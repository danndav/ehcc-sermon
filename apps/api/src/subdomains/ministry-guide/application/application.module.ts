import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { MinistryGuideService } from './services/ministry-guide.service';

@Module({
  imports: [InfrastructureModule],
  providers: [MinistryGuideService],
  exports: [MinistryGuideService],
})
export class ApplicationModule {}
