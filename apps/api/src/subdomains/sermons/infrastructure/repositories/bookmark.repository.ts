import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from '../../domain/entities/bookmark.entity';

@Injectable()
export class BookmarkRepository {
  constructor(
    @InjectRepository(Bookmark)
    private readonly repo: Repository<Bookmark>,
  ) {}

  async findByUser(userId: string): Promise<Bookmark[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findByUserAndSermon(userId: string, sermonId: string): Promise<Bookmark | null> {
    return this.repo.findOne({ where: { userId, sermonId } });
  }

  async toggle(userId: string, sermonId: string): Promise<{ bookmarked: boolean }> {
    const existing = await this.findByUserAndSermon(userId, sermonId);
    if (existing) {
      await this.repo.softRemove(existing);
      return { bookmarked: false };
    }
    await this.repo.save({ userId, sermonId });
    return { bookmarked: true };
  }
}
