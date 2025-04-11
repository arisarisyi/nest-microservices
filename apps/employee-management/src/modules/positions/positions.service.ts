import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PositionEntity } from '../../models/organization_structure/entities';

interface Position {
  id?: string;
  code?: string;
  position: string;
  alias?: string;
  nrp: string;
}

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(PositionEntity, 'os_connection')
    private readonly positionRepo: Repository<PositionEntity>,
  ) {}

  async getPosition(position: string) {
    try {
      const query = this.positionRepo
        .createQueryBuilder('position')
        .select([
          'position.id AS id',
          'position.code AS code',
          'IFNULL(position.alias, position.name )AS position',
        ])
        .orderBy('position.code', 'ASC');
      if (position != 'all') {
        query.where('position.name = :position', { position });
      }
      return await query.getRawMany();
    } catch (error) {}
  }

  async updatePosition(data: Position) {
    try {
      const { id, position, alias, nrp } = data;

      // Cek apakah nama position sudah ada (duplicate check)
      const positionExisting = await this.positionRepo.findOne({
        where: { name: position },
      });

      // Cek apakah position dengan ID yang diberikan ada
      const positionToUpdate = await this.positionRepo.findOne({
        where: { id },
      });

      //kirim message error ke hendling response
      if (!positionToUpdate) {
        throw new NotFoundException(`Position not found.`);
      }

      //kirim message error ke hendling response
      if (positionExisting && positionExisting.id !== id) {
        throw new ConflictException(`Position ${position} already.`);
      }
      const dataUpdate = {
        name: position,
        ...(alias && { alias }),
        updated_by: nrp,
      };
      const result = await this.positionRepo
        .createQueryBuilder()
        .update(PositionEntity)
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
      console.error('Error edit position', error);
      throw new InternalServerErrorException('Error process edit position.');
    }
  }

  async createdPosition(data: Position) {
    try {
      const { position, code, alias, nrp } = data;
      // Cek apakah nama position sudah ada (duplicate check)
      const positionExisting = await this.positionRepo.findOne({
        where: { name: position },
      });
      const codeExisting = await this.positionRepo.findOne({
        where: { code: code },
      });
      //kirim message error ke hendling response
      if (positionExisting) {
        throw new ConflictException(`Position ${position} already.`);
      }
      if (codeExisting) {
        throw new ConflictException(`Position ${code} already.`);
      }
      const dataCreated = {
        code,
        name: position,
        ...(alias && { alias }),
        created_by: nrp,
      };
      const result = await this.positionRepo
        .createQueryBuilder()
        .insert()
        .into(PositionEntity)
        .values(dataCreated)
        .execute();
      return result.raw.affectedRows;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Error created position', error);
      throw new InternalServerErrorException('Error process created position.');
    }
  }

  async destroyPosition(data: { id: string; nrp: string }) {
    try {
      const { id, nrp } = data;
      const result = await this.positionRepo
        .createQueryBuilder()
        .softDelete()
        .where('id = :id', { id })
        .execute();

      //kirim message error ke hendling response
      if (result.affected == 0) {
        throw new NotFoundException(`Position not found.`);
      }

      if (result.affected > 0) {
        await this.positionRepo
          .createQueryBuilder()
          .update(PositionEntity)
          .set({ deleted_by: nrp })
          .where('id = :id', { id })
          .andWhere('deleted_at IS NOT NULL')
          .execute();
      }
      return result.affected;
    } catch (error) {
      console.error('Error deleted position', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error process deleted position.');
    }
  }
}
