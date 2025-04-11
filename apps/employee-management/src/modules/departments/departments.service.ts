import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentEntity } from '../../models/organization_structure/entities';

interface Department {
  id?: string;
  department: string;
  alias?: string;
  nrp: string;
}

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(DepartmentEntity, 'os_connection')
    private readonly departmentRepo: Repository<DepartmentEntity>,
  ) {}

  async getDepartment(dept: string) {
    try {
      const query = this.departmentRepo
        .createQueryBuilder('dept')
        .select([
          'dept.id AS id',
          'dept.code AS code',
          'IFNULL(dept.alias, dept.name) AS department',
        ])
        .orderBy('dept.code', 'ASC');
      if (dept !== 'all') {
        query.where('dept.name = :dept', { dept });
      }
      return await query.getRawMany();
    } catch (error) {
      console.error('Error Featching Department:', error);
      throw new Error('Error Featching Department');
    }
  }

  async updateDepartment(data: Department) {
    try {
      const { id, department, alias, nrp } = data;

      // Cek apakah nama department sudah ada (duplicate check)
      const departmentExisting = await this.departmentRepo.findOne({
        where: { name: department },
      });

      // Cek apakah department dengan ID yang diberikan ada
      const departmentToUpdate = await this.departmentRepo.findOne({
        where: { id },
      });

      //kirim message error ke hendling response
      if (!departmentToUpdate) {
        throw new NotFoundException(`Department not found.`);
      }

      //kirim message error ke hendling response
      if (departmentExisting && departmentExisting.id !== id) {
        throw new ConflictException(`Department ${department} already.`);
      }

      const dataUpdate = {
        name: department,
        ...(alias && { alias }),
        updated_by: nrp,
      };
      const result = await this.departmentRepo
        .createQueryBuilder()
        .update(DepartmentEntity)
        .set(dataUpdate)
        .where('id = :id', { id })
        .execute();
      return result.affected;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      console.error('Error edit department', error);
      throw new InternalServerErrorException('Error process edit department.');
    }
  }

  async createdDepartment(data: Department) {
    try {
      const { department, alias, nrp } = data;
      // Cek apakah nama department sudah ada (duplicate check)
      const departmentExisting = await this.departmentRepo.findOne({
        where: { name: department },
      });
      //kirim message error ke hendling response
      if (departmentExisting) {
        throw new ConflictException(`Department ${department} already.`);
      }
      const code = await this.findCodeDepartment();
      const dataCreated = {
        code,
        name: department,
        ...(alias && { alias }),
        created_by: nrp,
      };
      const result = await this.departmentRepo
        .createQueryBuilder()
        .insert()
        .into(DepartmentEntity)
        .values(dataCreated)
        .execute();
      return result.raw.affectedRows;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Error created department', error);
      throw new InternalServerErrorException(
        'Error process created department.',
      );
    }
  }

  async findCodeDepartment() {
    try {
      const data = await this.departmentRepo
        .createQueryBuilder('dept')
        .select(['dept.code'])
        .withDeleted()
        .orderBy('dept.code', 'DESC')
        .getOne();
      let code: string;
      if (data) {
        const number = Number(data.code);
        code = number >= 10 ? (number + 1).toString() : `0${number + 1}`;
      } else {
        code = '01';
      }

      return code;
    } catch (error) {
      console.error('Error find code department', error);
      throw new Error('Error find code department');
    }
  }

  async destroyDeparment(data: { id: string; nrp: string }) {
    try {
      const { id, nrp } = data;
      const result = await this.departmentRepo
        .createQueryBuilder()
        .softDelete()
        .where('id = :id', { id })
        .execute();

      //kirim message error ke hendling response
      if (result.affected == 0) {
        throw new NotFoundException(`Department not found.`);
      }

      if (result.affected > 0) {
        await this.departmentRepo
          .createQueryBuilder()
          .update(DepartmentEntity)
          .set({ deleted_by: nrp })
          .where('id = :id', { id })
          .andWhere('deleted_at IS NOT NULL')
          .execute();
      }
      return result.affected;
    } catch (error) {
      console.error('Error deleted department', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error process deleted department.',
      );
    }
  }
}
