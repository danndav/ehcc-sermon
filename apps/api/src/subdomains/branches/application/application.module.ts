import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { BranchService } from './services/branch.service';

@Module({
  imports: [InfrastructureModule],
  providers: [BranchService],
  exports: [BranchService],
})
export class ApplicationModule {}
