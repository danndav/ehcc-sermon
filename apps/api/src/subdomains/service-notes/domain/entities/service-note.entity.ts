import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';
import { NoteProgrammeTypeEnum } from '../enums/note-programme-type.enum';
import { SubmissionTypeEnum } from '../enums/submission-type.enum';

@Entity('service_notes')
export class ServiceNote extends IEntity {
  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({ type: 'enum', enum: NoteProgrammeTypeEnum, name: 'programme_type' })
  programmeType: NoteProgrammeTypeEnum;

  @Column({ type: 'varchar', nullable: true, name: 'special_programme_name' })
  specialProgrammeName: string | null;

  @Column({ type: 'date', name: 'service_date' })
  serviceDate: string;

  @Column({ type: 'enum', enum: SubmissionTypeEnum, name: 'submission_type' })
  submissionType: SubmissionTypeEnum;

  @Column({ type: 'text', nullable: true, name: 'typed_content' })
  typedContent: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'file_url' })
  fileUrl: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'file_name' })
  fileName: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'file_type' })
  fileType: string | null;

  @Column({ type: 'int', nullable: true, name: 'branch_id' })
  branchId: number | null;

  @Column({ type: 'timestamp' })
  deadline: Date;

  @Column({ type: 'boolean', default: false, name: 'is_late' })
  isLate: boolean;
}
