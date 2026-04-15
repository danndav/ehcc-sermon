import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { SermonService } from './services/sermon.service';
import { SeriesService } from './services/series.service';
import { PastorService } from './services/pastor.service';
import { WatchHistoryService } from './services/watch-history.service';
import { VerseService } from './services/verse.service';
import { SermonMetadataService } from './services/sermon-metadata.service';
import { BookmarkService } from './services/bookmark.service';
import { UserNoteService } from './services/user-note.service';

@Module({
  imports: [InfrastructureModule],
  providers: [SermonService, SeriesService, PastorService, WatchHistoryService, VerseService, SermonMetadataService, BookmarkService, UserNoteService],
  exports: [SermonService, SeriesService, PastorService, WatchHistoryService, VerseService, SermonMetadataService, BookmarkService, UserNoteService],
})
export class ApplicationModule {}
