import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserNote } from '../../domain/entities/user-note.entity';

@Injectable()
export class UserNoteRepository {
  constructor(
    @InjectRepository(UserNote)
    private readonly repo: Repository<UserNote>,
  ) {}

  async findByUser(userId: string): Promise<UserNote[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findByUserAndSermon(userId: string, sermonId: string): Promise<UserNote[]> {
    return this.repo.find({ where: { userId, sermonId }, order: { transcriptTimestamp: 'ASC' } });
  }

  async findById(id: string): Promise<UserNote | null> {
    return this.repo.findOne({ where: { id } });
  }

  async save(data: Partial<UserNote>): Promise<UserNote> {
    return this.repo.save(data);
  }

  async remove(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }
}
