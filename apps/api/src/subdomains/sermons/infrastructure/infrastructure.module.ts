import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sermon } from '../domain/entities/sermon.entity';
import { SermonMetadata } from '../domain/entities/sermon-metadata.entity';
import { Series } from '../domain/entities/series.entity';
import { Pastor } from '../domain/entities/pastor.entity';
import { WatchHistory } from '../domain/entities/watch-history.entity';
import { Bookmark } from '../domain/entities/bookmark.entity';
import { UserNote } from '../domain/entities/user-note.entity';
import { SermonRepository } from './repositories/sermon.repository';
import { SeriesRepository } from './repositories/series.repository';
import { PastorRepository } from './repositories/pastor.repository';
import { WatchHistoryRepository } from './repositories/watch-history.repository';
import { BookmarkRepository } from './repositories/bookmark.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sermon, SermonMetadata, Series, Pastor, WatchHistory, Bookmark, UserNote]),
  ],
  providers: [SermonRepository, SeriesRepository, PastorRepository, WatchHistoryRepository, BookmarkRepository],
  exports: [SermonRepository, SeriesRepository, PastorRepository, WatchHistoryRepository, BookmarkRepository],
})
export class InfrastructureModule {}
