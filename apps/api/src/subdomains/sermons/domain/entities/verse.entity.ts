import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';

export enum VerseTypeEnum {
  WEEK = 'week',
  YEAR = 'year',
}

@Entity('verses')
export class Verse extends IEntity {
  @Column({ type: 'enum', enum: VerseTypeEnum })
  type: VerseTypeEnum;

  @Column({ type: 'text' })
  scripture: string;

  @Column({ type: 'varchar', length: 100 })
  reference: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  translation: string | null;

  @Column({ type: 'int', nullable: true, name: 'branch_id' })
  branchId: number | null;

  @Column({ type: 'date', name: 'start_date' })
  startDate: string;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: string | null;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'set_by' })
  setBy: string | null;
}
