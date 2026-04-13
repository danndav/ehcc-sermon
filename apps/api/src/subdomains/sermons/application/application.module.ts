import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { SermonService } from './services/sermon.service';
import { SeriesService } from './services/series.service';
import { PastorService } from './services/pastor.service';
import { WatchHistoryService } from './services/watch-history.service';

@Module({
  imports: [InfrastructureModule],
  providers: [SermonService, SeriesService, PastorService, WatchHistoryService],
  exports: [SermonService, SeriesService, PastorService, WatchHistoryService],
})
export class ApplicationModule {}
