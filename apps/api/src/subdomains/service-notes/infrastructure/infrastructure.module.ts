import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceNote } from '../domain/entities/service-note.entity';
import { ServiceNoteRepository } from './repositories/service-note.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceNote])],
  providers: [ServiceNoteRepository],
  exports: [ServiceNoteRepository],
})
export class InfrastructureModule {}
