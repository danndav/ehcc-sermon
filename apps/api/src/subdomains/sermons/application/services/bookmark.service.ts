import { Injectable } from '@nestjs/common';
import { BookmarkRepository } from '../../infrastructure/repositories/bookmark.repository';

@Injectable()
export class BookmarkService {
  constructor(private readonly bookmarkRepository: BookmarkRepository) {}

  async toggle(userId: string, sermonId: string) {
    return this.bookmarkRepository.toggle(userId, sermonId);
  }

  async getByUser(userId: string) {
    return this.bookmarkRepository.findByUser(userId);
  }

  async isBookmarked(userId: string, sermonId: string): Promise<boolean> {
    const bookmark = await this.bookmarkRepository.findByUserAndSermon(userId, sermonId);
    return !!bookmark;
  }
}
