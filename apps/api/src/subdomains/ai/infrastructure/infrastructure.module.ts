import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Devotional } from '../domain/entities/devotional.entity';
import { DevotionalRepository } from './repositories/devotional.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Devotional])],
  providers: [DevotionalRepository],
  exports: [DevotionalRepository],
})
export class InfrastructureModule {}
