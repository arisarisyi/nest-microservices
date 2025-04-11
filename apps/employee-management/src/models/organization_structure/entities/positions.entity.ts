import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('tbl_m_positions')
export class PositionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 17, unique: true, nullable: false })
  code: string;

  @Column({ type: 'varchar', length: 250, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 99, nullable: false })
  alias: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'varchar', length: 35, nullable: true })
  created_by: string | null;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date | null;

  @Column({ type: 'varchar', length: 35, nullable: true })
  updated_by: string | null;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @Column({ type: 'varchar', length: 35, nullable: true })
  deleted_by: string | null;
}
