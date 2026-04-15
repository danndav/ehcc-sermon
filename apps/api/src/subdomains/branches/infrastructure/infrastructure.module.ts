import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from '../domain/entities/branch.entity';
import { BranchRepository } from './repositories/branch.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Branch])],
  providers: [BranchRepository],
  exports: [BranchRepository],
})
export class InfrastructureModule {}
