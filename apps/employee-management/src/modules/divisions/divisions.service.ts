import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DivisionEntity } from '../../models/organization_structure/entities';

interface Division {
  id?: string;
  division: string;
  alias?: string;
  nrp: string;
}
@Injectable()
export class DivisionsService {
  constructor(
    @InjectRepository(DivisionEntity, 'os_connection')
    private readonly divisionRepo: Repository<DivisionEntity>,
  ) {}

  async getDivision(divisi: string) {
    try {
      const query = this.divisionRepo
        .createQueryBuilder('divisi')
        .select([
          'divisi.id AS id',
          'divisi.code AS code',
          'IFNULL(divisi.alias, divisi.name) AS division',
        ])
        .orderBy('divisi.code', 'ASC');
      if (divisi != 'all') {
        query.where('divisi.name = :divisi', { divisi });
      }
      return await query.getRawMany();
    } catch (error) {
      console.error('Error Featching Division:', error);
      throw new Error('Error Featching Division');
    }
  }

  async updatedDivision(data: Division) {
    try {
      const { id, division, alias, nrp } = data;
      // Cek apakah nama department sudah ada (duplicate check)
      const divisionExisting = await this.divisionRepo.findOne({
        where: { name: division },
      });

      // Cek apakah department dengan ID yang diberikan ada
      const divisionToUpdate = await this.divisionRepo.findOne({
        where: { id },
      });
      //kirim message error ke hendling response
      if (!divisionToUpdate) {
        throw new NotFoundException(`Division not found.`);
      }
      //kirim message error ke hendling response
      if (divisionExisting && divisionExisting.id !== id) {
        throw new ConflictException(`Division ${division} already.`);
      }

      const dataUpdate = {
        name: division,
        ...(alias && { alias }),
        updated_by: nrp,
      };
      const result = await this.divisionRepo
        .createQueryBuilder()
        .update(DivisionEntity)
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
      console.error('Error edit division', error);
      throw new InternalServerErrorException('Error process edit division.');
    }
  }

  async createdDivision(data: Division) {
    try {
      const { division, alias, nrp } = data;
      // Cek apakah nama department sudah ada (duplicate check)
      const departmentExisting = await this.divisionRepo.findOne({
        where: { name: division },
      });
      //kirim message error ke hendling response
      if (departmentExisting) {
        throw new ConflictException(`Department ${division} already.`);
      }
      const code = await this.findCodeDivision();
      const dataCreated = {
        code,
        name: division,
        ...(alias && { alias }),
        created_by: nrp,
      };
      const result = await this.divisionRepo
        .createQueryBuilder()
        .insert()
        .into(DivisionEntity)
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

  async findCodeDivision() {
    try {
      const lastEntry = await this.divisionRepo
        .createQueryBuilder('divisi')
        .select(['divisi.code'])
        .withDeleted()
        .orderBy('divisi.code', 'DESC')
        .getOne();
      // Jika tidak ada data, mulai dari 'A'
      const lastCode = lastEntry ? lastEntry.code : null;
      return this.getNextAlphabetCode(lastCode);
    } catch (error) {
      console.error('Error find code department', error);
      throw new Error('Error find code department');
    }
  }

  getNextAlphabetCode(lastCode: string | null): string {
    if (!lastCode) return 'A'; // Jika belum ada data, mulai dari 'A'

    let nextCode = '';
    let carry = true;

    // Proses dari belakang ke depan untuk menangani carry (seperti penjumlahan angka)
    for (let i = lastCode.length - 1; i >= 0; i--) {
      let nextChar = lastCode.charCodeAt(i) + (carry ? 1 : 0);

      if (nextChar > 90) {
        // 90 = 'Z'
        nextChar = 65; // Ubah ke 'A'
        carry = true; // Lanjutkan carry ke karakter sebelumnya
      } else {
        carry = false; // Tidak ada carry lagi
      }

      nextCode = String.fromCharCode(nextChar) + nextCode;
    }

    // Jika masih ada carry setelah looping, tambahkan 'A' di depan
    if (carry) nextCode = 'A' + nextCode;

    return nextCode;
  }

  async destroyDivision(data: { id: string; nrp: string }) {
    try {
      const { id, nrp } = data;
      const result = await this.divisionRepo
        .createQueryBuilder()
        .softDelete()
        .where('id = :id', { id })
        .execute();

      //kirim message error ke hendling response
      if (result.affected == 0) {
        throw new NotFoundException(`Division not found.`);
      }

      if (result.affected > 0) {
        await this.divisionRepo
          .createQueryBuilder()
          .update(DivisionEntity)
          .set({ deleted_by: nrp })
          .where('id = :id', { id })
          .andWhere('deleted_at IS NOT NULL')
          .execute();
      }
      return result.affected;
    } catch (error) {
      console.error('Error deleted division', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error process deleted division.');
    }
  }
}
