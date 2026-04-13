import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../domain/entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserReadRepository } from './repositories/read/user.read-repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserRepository, UserReadRepository],
  exports: [UserRepository, UserReadRepository],
})
export class InfrastructureModule {}
