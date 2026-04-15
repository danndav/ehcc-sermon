import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoProject } from '../domain/entities/video-project.entity';
import { VideoProjectRepository } from './repositories/video-project.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VideoProject])],
  providers: [VideoProjectRepository],
  exports: [VideoProjectRepository],
})
export class InfrastructureModule {}
