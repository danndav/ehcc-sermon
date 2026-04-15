import { Injectable, NotFoundException } from '@nestjs/common';
import { UserNoteRepository } from '../../infrastructure/repositories/user-note.repository';

@Injectable()
export class UserNoteService {
  constructor(private readonly repo: UserNoteRepository) {}

  async findByUser(userId: string) {
    return this.repo.findByUser(userId);
  }

  async findByUserAndSermon(userId: string, sermonId: string) {
    return this.repo.findByUserAndSermon(userId, sermonId);
  }

  async create(userId: string, sermonId: string, noteText: string, transcriptTimestamp?: number, highlightedText?: string) {
    return this.repo.save({
      userId,
      sermonId,
      noteText,
      transcriptTimestamp: transcriptTimestamp ?? null,
      highlightedText: highlightedText ?? null,
    });
  }

  async remove(id: string, userId: string) {
    const note = await this.repo.findById(id);
    if (!note || note.userId !== userId) throw new NotFoundException('Note not found');
    await this.repo.remove(id);
    return { deleted: true };
  }
}
