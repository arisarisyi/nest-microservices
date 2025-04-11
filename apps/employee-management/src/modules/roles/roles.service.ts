import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as dotenv from 'dotenv';
import {
  DepartmentEntity,
  DivisionEntity,
  PositionEntity,
  RoleEntity,
} from '../../models/organization_structure/entities';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
dotenv.config();

interface Roles {
  id?: string;
  type?: string;
  position?: string;
  division?: string;
  department?: string;
  role?: string;
  nrp?: string;
}
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(PositionEntity, 'os_connection')
    private readonly positionRepo: Repository<PositionEntity>,

    @InjectRepository(DivisionEntity, 'os_connection')
    private readonly divisionRepo: Repository<DivisionEntity>,

    @InjectRepository(DepartmentEntity, 'os_connection')
    private readonly departmentRepo: Repository<DepartmentEntity>,

    @InjectRepository(RoleEntity, 'os_connection')
    private readonly roleRepo: Repository<RoleEntity>,

    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,

    private readonly httpService: HttpService,
  ) {}

  async getOneType(type: string) {
    const url = `${process.env.DOMAIN_TENAN}/tenan-type/list`;
    const params = {
      type,
    };
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { params }),
      );
      return response.data.data[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new Error(`Error fetching one type: ${error.message}`);
    }
  }

  async getAllType() {
    const url = `${process.env.DOMAIN_TENAN}/tenan-type/all-list`;
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data.data;
    } catch (error) {
      this.logger.error(error.message);
      throw new Error(`Error fetching all type: ${error.message}`);
    }
  }

  async getRole(
    page: number,
    limit: number,
    type?: string,
    position?: string,
    department?: string,
    division?: string,
  ) {
    try {
      const tenan = await this.getOneType(type);
      const query = this.roleRepo
        .createQueryBuilder('role')
        .leftJoin(PositionEntity, 'position', 'role.position_id = position.id')
        .leftJoin(DivisionEntity, 'division', 'role.division_id = division.id')
        .leftJoin(
          DepartmentEntity,
          'department',
          'role.department_id = department.id',
        )
        .orderBy('role.code', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      if (type && tenan.id) {
        query.andWhere('role.type_id = :type', { type: tenan.id });
      }
      if (position) {
        query.andWhere('position.name = :position', { position });
      }
      if (department) {
        query.andWhere('department.name = :department', { department });
      }
      if (division) {
        query.andWhere('division.name = :division', { division });
      }
      const [data, total] = await query.getManyAndCount();
      const [divisions, positions, departments, types] = await Promise.all([
        this.getDivision(),
        this.getPosition(),
        this.getDepartment(),
        this.getAllType(),
      ]);
      const result = await this.formatingRoles(
        data,
        divisions,
        positions,
        departments,
        types,
      );

      return {
        position: result,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Error Fetching Role:', error);
      throw new Error('Error Fetching Role');
    }
  }

  async formatingRoles(
    roles: RoleEntity[],
    divisions: DivisionEntity[],
    positions: PositionEntity[],
    departments: DepartmentEntity[],
    types,
  ) {
    try {
      return roles.map(
        ({
          id,
          job_code,
          name,
          type_id,
          division_id,
          department_id,
          position_id,
        }) => {
          const itemType = types.find((item) => item.id == type_id);
          const itemDivs = divisions.find((item) => item.id == division_id);
          const itemPosi = positions.find((item) => item.id == position_id);
          const itemDept = departments.find((item) => item.id == department_id);
          return {
            id,
            jobCode: job_code,
            type: itemType.name,
            position: itemPosi.name,
            division: itemDivs.name,
            department: itemDept.name,
            role: name,
          };
        },
      );
    } catch (error) {
      this.logger.error('Error Processing formating Role:', error);
      throw new Error('Error Processing formating Role');
    }
  }

  async getDivision() {
    try {
      const query = this.divisionRepo
        .createQueryBuilder('divisi')
        .select(['divisi.id AS id', 'divisi.name AS name'])
        .orderBy('divisi.code', 'ASC');
      return await query.getRawMany();
    } catch (error) {
      this.logger.error('Error Featching Division:', error);
      throw new Error('Error Featching Division');
    }
  }

  async getPosition() {
    try {
      const query = this.positionRepo
        .createQueryBuilder('position')
        .select(['position.id AS id', 'position.name AS name'])
        .orderBy('position.code', 'ASC');
      return await query.getRawMany();
    } catch (error) {
      this.logger.error('Error Fetching Position:', error);
      throw new Error('Error Fetching Position');
    }
  }

  async getDepartment() {
    try {
      const query = this.departmentRepo
        .createQueryBuilder('dept')
        .select(['dept.id AS id', 'dept.name AS name'])
        .orderBy('dept.code', 'ASC');
      return await query.getRawMany();
    } catch (error) {
      this.logger.error('Error Featching Department:', error);
      throw new Error('Error Featching Department');
    }
  }

  async updatedRole(data: Roles) {
    try {
      const { id, type, position, division, department, role, nrp } = data;
      // Cek apakah role dengan ID yang diberikan ada
      const roleToUpdate = await this.roleRepo.findOneBy({ id });
      if (!roleToUpdate) {
        throw new NotFoundException(`Role not found.`);
      }
      // Cek apakah nama role sudah ada (duplicate check)
      const roleExisting = await this.rolesExisting(
        role,
        type,
        position,
        division,
        department,
      );

      // kirim message error ke hendling response
      if (roleExisting && roleExisting.id !== id) {
        throw new ConflictException(`Role ${role} already exists.`);
      }

      const [typeNew, positionNew, divisionNew, departmentNew] =
        await Promise.all([
          this.getOneType(type),
          this.positionRepo.findOneBy({ name: position }),
          this.divisionRepo.findOneBy({ name: division }),
          this.departmentRepo.findOneBy({ name: department }),
        ]);

      const chekJobCode = await this.chekJobCode(
        typeNew,
        positionNew,
        divisionNew,
        departmentNew,
        roleToUpdate,
        'chek',
      );

      //Jika terjadi perubahan role saja
      if (chekJobCode == roleToUpdate.job_code) {
        const result = await this.updateRole(id, {
          name: role,
          updated_by: nrp,
        });
        return result.affected;
      }

      //Jika terjadi perubahan pada beberapa item
      if (chekJobCode !== roleToUpdate.job_code) {
        const lastRole = await this.lastRoles(
          type,
          position,
          division,
          department,
        );

        const jobCodeNew = await this.chekJobCode(
          typeNew,
          positionNew,
          divisionNew,
          departmentNew,
          lastRole,
          'new',
        );

        const result = await this.updateRole(id, {
          job_code: jobCodeNew,
          code: (lastRole?.code || 0) + 1,
          name: role,
          type_id: typeNew?.id,
          position_id: positionNew?.id,
          division_id: divisionNew?.id,
          department_id: departmentNew?.id,
          updated_by: nrp,
        });
        return result.affected;
      }
    } catch (error) {
      const message = 'Error processing update role.';
      this.logger.error(message);
      this.handleError(error, message);
    }
  }

  private async updateRole(id: string, data: Partial<RoleEntity>) {
    return await this.roleRepo
      .createQueryBuilder()
      .update(RoleEntity)
      .set(data)
      .where('id = :id', { id })
      .execute();
  }

  async chekJobCode(
    type,
    position: PositionEntity,
    division: DivisionEntity,
    department: DepartmentEntity,
    role: RoleEntity,
    status: string,
  ) {
    try {
      const codeType = type.code;
      const codePosition = position.code;
      const codeDivision = division.code;
      const codeDepartment = department.code;
      let codeRole = null;
      if (status == 'chek') {
        codeRole = this.formatNumber(role.code);
      } else {
        const number = role.code !== undefined ? role.code + 1 : 1;
        codeRole = this.formatNumber(number);
      }
      const result =
        codeType + codePosition + codeDivision + codeDepartment + codeRole;
      return result;
    } catch (error) {
      this.logger.error(error);
    }
  }

  formatNumber(num: number): string {
    return num.toString().padStart(3, '0');
  }

  async createdRole(data: Roles) {
    try {
      const { type, position, division, department, role, nrp } = data;
      const roleExisting = await this.rolesExisting(
        role,
        type,
        position,
        division,
        department,
      );
      // kirim message error ke hendling response
      if (roleExisting) {
        throw new ConflictException(`Role ${role} already exists.`);
      }
      const [typeNew, positionNew, divisionNew, departmentNew] =
        await Promise.all([
          this.getOneType(type),
          this.positionRepo.findOneBy({ name: position }),
          this.divisionRepo.findOneBy({ name: division }),
          this.departmentRepo.findOneBy({ name: department }),
        ]);

      const lastRole = await this.lastRoles(
        type,
        position,
        division,
        department,
      );

      const jobCodeNew = await this.chekJobCode(
        typeNew,
        positionNew,
        divisionNew,
        departmentNew,
        lastRole,
        'new',
      );
      const dataCreated = {
        job_code: jobCodeNew,
        code: (lastRole?.code || 0) + 1,
        name: role,
        type_id: typeNew?.id,
        position_id: positionNew?.id,
        division_id: divisionNew?.id,
        department_id: departmentNew?.id,
        created_by: nrp,
      };
      const result = await this.roleRepo
        .createQueryBuilder()
        .insert()
        .into(RoleEntity)
        .values(dataCreated)
        .execute();
      return result.raw.affectedRows;
    } catch (error) {
      const message = 'Error processing created role.';
      this.logger.error(message);
      this.handleError(error, message);
    }
  }

  async destroyRole(data: { id: string; nrp: string }) {
    try {
      const { id, nrp } = data;
      const result = await this.roleRepo
        .createQueryBuilder()
        .softDelete()
        .where('id = :id', { id })
        .execute();

      //kirim message error ke hendling response
      if (result.affected == 0) {
        throw new NotFoundException(`Role not found.`);
      }

      if (result.affected > 0) {
        await this.roleRepo
          .createQueryBuilder()
          .update(RoleEntity)
          .set({ deleted_by: nrp })
          .where('id = :id', { id })
          .andWhere('deleted_at IS NOT NULL')
          .execute();
      }
      return result.affected;
    } catch (error) {
      console.error('Error deleted role', error);
      const message = 'Error processing deleted role.';
      this.handleError(error, message);
    }
  }

  private async lastRoles(
    type: string,
    position: string,
    division: string,
    department: string,
  ) {
    try {
      const tenan = await this.getOneType(type);
      return await this.roleRepo
        .createQueryBuilder('role')
        .leftJoin(PositionEntity, 'position', 'role.position_id = position.id')
        .leftJoin(DivisionEntity, 'division', 'role.division_id = division.id')
        .leftJoin(
          DepartmentEntity,
          'department',
          'role.department_id = department.id',
        )
        .andWhere('role.type_id = :type', { type: tenan.id })
        .andWhere('position.name = :position', { position })
        .andWhere('division.name = :division', { division })
        .andWhere('department.name = :department', { department })
        .orderBy('role.code', 'DESC')
        .getOne();
    } catch (error) {
      this.logger.error('Error Fetching Last Role:', error);
      throw new Error('Error Fetching Last Role');
    }
  }

  private async rolesExisting(
    role: string,
    type: string,
    position: string,
    division: string,
    department: string,
  ) {
    try {
      const tenan = await this.getOneType(type);
      return await this.roleRepo
        .createQueryBuilder('role')
        .leftJoin(PositionEntity, 'position', 'role.position_id = position.id')
        .leftJoin(DivisionEntity, 'division', 'role.division_id = division.id')
        .leftJoin(
          DepartmentEntity,
          'department',
          'role.department_id = department.id',
        )
        .where('role.name = :role', { role })
        .andWhere('role.type_id = :type', { type: tenan.id })
        .andWhere('position.name = :position', { position })
        .andWhere('division.name = :division', { division })
        .andWhere('department.name = :department', { department })
        .getOne();
    } catch (error) {
      this.logger.error('Error Fetching Role Existing:', error);
      throw new Error('Error Fetching Role Existing');
    }
  }

  private handleError(error: any, message: string) {
    if (
      error instanceof ConflictException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }
    throw new InternalServerErrorException(message);
  }
}
