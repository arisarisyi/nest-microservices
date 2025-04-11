import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('tbl_m_roles')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 99, nullable: true })
  job_code: string | null;

  @Column({ type: 'int', width: 12, nullable: false, default: 0 })
  code: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 75, nullable: true })
  alias: string | null;

  @Column({ type: 'char', length: 36, nullable: false })
  type_id: string;

  @Column({ type: 'char', length: 36, nullable: false })
  position_id: string;

  @Column({ type: 'char', length: 36, nullable: false })
  division_id: string;

  @Column({ type: 'char', length: 36, nullable: false })
  department_id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'varchar', length: 37, nullable: true })
  created_by: string | null;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date | null;

  @Column({ type: 'varchar', length: 37, nullable: true })
  updated_by: string | null;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @Column({ type: 'varchar', length: 37, nullable: true })
  deleted_by: string | null;
}
