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
}
