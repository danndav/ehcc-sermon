import { Injectable, NotFoundException } from '@nestjs/common';
import { SermonMetadataRepository } from '../../infrastructure/repositories/sermon-metadata.repository';
import { SermonMetadata } from '../../domain/entities/sermon-metadata.entity';

@Injectable()
export class SermonMetadataService {
  constructor(private readonly repo: SermonMetadataRepository) {}

  async findBySermonId(sermonId: string): Promise<SermonMetadata> {
    const metadata = await this.repo.findBySermonId(sermonId);
    if (!metadata) throw new NotFoundException(`No metadata found for sermon ${sermonId}`);
    return metadata;
  }

  async getTranscript(sermonId: string): Promise<{
    text: string | null;
    timestamps: { start: number; end: number; text: string }[] | null;
  }> {
    const metadata = await this.repo.findBySermonId(sermonId);
    return {
      text: metadata?.transcriptText || null,
      timestamps: metadata?.transcriptTimestamps || null,
    };
  }

  async saveTranscript(sermonId: string, text: string, timestamps: { start: number; end: number; text: string }[]): Promise<SermonMetadata> {
    return this.repo.upsertBySermonId(sermonId, {
      transcriptText: text,
      transcriptTimestamps: timestamps,
    });
  }

  async saveSummaryAndTags(sermonId: string, summary: string, tags: string[]): Promise<SermonMetadata> {
    return this.repo.upsertBySermonId(sermonId, { summary, tags });
  }
}
