import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchHistory } from '../../domain/entities/watch-history.entity';

@Injectable()
export class WatchHistoryRepository {
  constructor(
    @InjectRepository(WatchHistory)
    private readonly repo: Repository<WatchHistory>,
  ) {}
}
