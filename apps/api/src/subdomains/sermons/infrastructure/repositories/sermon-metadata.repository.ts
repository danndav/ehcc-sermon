import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SermonMetadata } from '../../domain/entities/sermon-metadata.entity';

@Injectable()
export class SermonMetadataRepository {
  constructor(
    @InjectRepository(SermonMetadata)
    private readonly repo: Repository<SermonMetadata>,
  ) {}

  async findBySermonId(sermonId: string): Promise<SermonMetadata | null> {
    return this.repo.findOne({ where: { sermonId } });
  }

  async save(data: Partial<SermonMetadata>): Promise<SermonMetadata> {
    return this.repo.save(data);
  }

  async upsertBySermonId(sermonId: string, data: Partial<SermonMetadata>): Promise<SermonMetadata> {
    const existing = await this.findBySermonId(sermonId);
    if (existing) {
      return this.repo.save({ ...existing, ...data });
    }
    return this.repo.save({ sermonId, ...data });
  }
}
