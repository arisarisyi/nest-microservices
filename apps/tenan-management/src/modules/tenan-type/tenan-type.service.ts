import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenanTypeEntity } from '../../models/tenan/entities/tenan-type.entities';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

interface Tenan {
  id?: string;
  type?: string;
  code?: string;
  alias?: string;
  nrp: string;
}
export type TenanType = {
  id: string;
  code?: string;
  type: string;
};

@Injectable()
export class TenanTypeService {
  constructor(
    @InjectRepository(TenanTypeEntity, 'hrd_connection')
    private readonly tenanTypeRepo: Repository<TenanTypeEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getTenanType(type: string): Promise<TenanType[]> {
    try {
      const query = this.tenanTypeRepo
        .createQueryBuilder('type')
        .select(['type.id AS id', 'type.code AS code', 'type.name AS type'])
        .orderBy('type.code', 'ASC');

      if (type !== 'all') {
        query.where('type.name = :type', { type });
      }
      const result: TenanType[] = await query.getRawMany();
      return result;
    } catch (error) {
      this.logger.error('Error Fetching Tenan Type:', error);
      throw new Error('Error Fetching Tenan Type');
    }
  }

  async updateTenanType(data: Tenan) {
    try {
      const { id, type, alias, nrp } = data;

      // Cek apakah nama type sudah ada (duplicate check)
      const typeExisting = await this.tenanTypeRepo.findOne({
        where: { name: type },
      });

      // Cek apakah type dengan ID yang diberikan ada
      const typeToUpdate = await this.tenanTypeRepo.findOne({
        where: { id },
      });

      if (!typeToUpdate) {
        throw new NotFoundException(`Type not found.`);
      }
      //kirim message error ke hendling response
      if (typeExisting && typeExisting.id !== id) {
        throw new ConflictException(`Type ${type} already.`);
      }
      //kirim message error ke hendling response

      const dataUpdate = {
        name: type,
        ...(alias && { alias }),
        updated_by: nrp,
      };
      const result = await this.tenanTypeRepo
        .createQueryBuilder()
        .update(TenanTypeEntity)
        .set(dataUpdate)
        .where('id = :id', { id })
        .execute();
      return result.affected;
    } catch (error) {
      this.logger.error('Error edit type', error);
      const message = 'Error process edit type.';
      this.handleError(error, message);
    }
  }

  async createdTenanType(data: Tenan) {
    try {
      const { type, code, alias, nrp } = data;
      // Cek apakah nama type sudah ada (duplicate check)
      const typeExisting = await this.tenanTypeRepo.findOne({
        where: { name: type },
      });
      const codeExisting = await this.tenanTypeRepo.findOne({
        where: { code: code },
      });
      //kirim message error ke hendling response
      if (typeExisting) {
        throw new ConflictException(`Tenan Type ${type} already.`);
      }
      if (codeExisting) {
        throw new ConflictException(`Tenan Code ${code} already.`);
      }
      const dataCreated = {
        code,
        name: type,
        ...(alias && { alias }),
        created_by: nrp,
      };
      const result = await this.tenanTypeRepo
        .createQueryBuilder()
        .insert()
        .into(TenanTypeEntity)
        .values(dataCreated)
        .execute();
      return result ? 1 : 0;
    } catch (error) {
      this.logger.error('Error created type', error);
      const message = 'Error process created type.';
      this.handleError(error, message);
    }
  }

  async destroyTenanType(data: { id: string; nrp: string }) {
    try {
      const { id, nrp } = data;
      const result = await this.tenanTypeRepo
        .createQueryBuilder()
        .softDelete()
        .where('id = :id', { id })
        .execute();

      //kirim message error ke hendling response
      if (result.affected == 0) {
        throw new NotFoundException(`Type not found.`);
      }
      if (result.affected) {
        await this.tenanTypeRepo
          .createQueryBuilder()
          .update(TenanTypeEntity)
          .set({ deleted_by: nrp })
          .where('id = :id', { id })
          .andWhere('deleted_at IS NOT NULL')
          .execute();
      }

      return result ? 1 : 0;
    } catch (error) {
      this.logger.error('Error deleted type', error);
      const message = 'Error process deleted type.';
      this.handleError(error, message);
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

  async getAllType(): Promise<TenanType[]> {
    try {
      const query = this.tenanTypeRepo
        .createQueryBuilder('type')
        .select(['type.id AS id', 'type.code AS code', 'type.name AS type'])
        .orderBy('type.code', 'ASC');
      const result: TenanType[] = await query.getRawMany();
      return result;
    } catch (error) {
      this.logger.error('Error Featching Department:', error);
      throw new Error('Error Featching Department');
    }
  }
}
