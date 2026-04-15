import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';

export enum VideoStatusEnum {
  UPLOADED = 'uploaded',
  TRANSCODING = 'transcoding',
  READY = 'ready',
  FAILED = 'failed',
}

@Entity('video_projects')
export class VideoProject extends IEntity {
  @Column({ type: 'uuid', name: 'sermon_id', unique: true })
  sermonId: string;

  @Column({ type: 'varchar', nullable: true, name: 'raw_r2_key' })
  rawR2Key: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'hls_prefix' })
  hlsPrefix: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'thumbnail_key' })
  thumbnailKey: string | null;

  @Column({ type: 'enum', enum: VideoStatusEnum, default: VideoStatusEnum.UPLOADED })
  status: VideoStatusEnum;

  @Column({ type: 'varchar', nullable: true, name: 'error_message' })
  errorMessage: string | null;

  @Column({ type: 'int', nullable: true, name: 'duration_seconds' })
  durationSeconds: number | null;

  @Column({ type: 'bigint', nullable: true, name: 'file_size_bytes' })
  fileSizeBytes: number | null;

  @Column({ type: 'boolean', default: false, name: 'raw_deleted' })
  rawDeleted: boolean;

  @Column({ type: 'jsonb', nullable: true, name: 'transcode_progress' })
  transcodeProgress: Record<string, number> | null;
}
