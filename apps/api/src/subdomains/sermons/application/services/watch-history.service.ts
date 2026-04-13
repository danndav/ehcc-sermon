import { Injectable } from '@nestjs/common';
import { WatchHistoryRepository } from '../../infrastructure/repositories/watch-history.repository';

@Injectable()
export class WatchHistoryService {
  constructor(private readonly watchHistoryRepository: WatchHistoryRepository) {}
}
