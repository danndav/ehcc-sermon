import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';
import { SermonStatusEnum } from '../enums/sermon-status.enum';
import { ProgrammeTypeEnum, ThreeDGDayEnum, ProgrammeSessionEnum } from '../enums/programme-type.enum';
import { MediaTypeEnum } from '../enums/media-type.enum';

@Entity('sermons')
export class Sermon extends IEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'uuid', name: 'pastor_id', nullable: true })
  pastorId: string | null;

  @Column({ type: 'uuid', name: 'series_id', nullable: true })
  seriesId: string | null;

  @Column({ type: 'enum', enum: MediaTypeEnum, default: MediaTypeEnum.VIDEO, name: 'media_type' })
  mediaType: MediaTypeEnum;

  @Column({ type: 'varchar', nullable: true, name: 'video_url' })
  videoUrl: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'audio_url' })
  audioUrl: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'youtube_url' })
  youtubeUrl: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'thumbnail_url' })
  thumbnailUrl: string | null;

  @Column({ type: 'boolean', default: true, name: 'is_free' })
  isFree: boolean;

  @Column({ type: 'int', default: 0, name: 'view_count' })
  viewCount: number;

  @Column({ type: 'int', nullable: true })
  duration: number | null;

  @Column({ type: 'enum', enum: SermonStatusEnum, default: SermonStatusEnum.DRAFT })
  status: SermonStatusEnum;

  @Column({ type: 'enum', enum: ProgrammeTypeEnum, default: ProgrammeTypeEnum.SUNDAY_SERVICE, name: 'programme_type' })
  programmeType: ProgrammeTypeEnum;

  @Column({ type: 'varchar', nullable: true, name: 'special_programme_name' })
  specialProgrammeName: string | null;

  // 3DG-specific fields
  @Column({ type: 'int', nullable: true, name: 'three_dg_day' })
  threeDgDay: ThreeDGDayEnum | null;

  @Column({ type: 'enum', enum: ProgrammeSessionEnum, nullable: true, name: 'programme_session' })
  programmeSession: ProgrammeSessionEnum | null;

  @Column({ type: 'int', nullable: true, name: 'branch_id' })
  branchId: number | null;

  @Column({ type: 'boolean', default: false, name: 'auto_publish' })
  autoPublish: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'published_at' })
  publishedAt: Date | null;
}
