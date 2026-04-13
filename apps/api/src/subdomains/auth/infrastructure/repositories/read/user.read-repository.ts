import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../domain/entities/user.entity';
import { UserReadModel } from '../../../domain/read-models/user.read-model';

@Injectable()
export class UserReadRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<UserReadModel | null> {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .select([
        'users.id AS "id"',
        'users.name AS "name"',
        'users.email AS "email"',
        'users.avatar_url AS "avatarUrl"',
        'users.role AS "role"',
        'users.is_email_verified AS "isEmailVerified"',
        'users.is_suspended AS "isSuspended"',
        'users.created_at AS "createdAt"',
        'users.updated_at AS "updatedAt"',
      ])
      .where('users.email = :email', { email })
      .andWhere('users.deleted_at IS NULL')
      .getRawOne();

    return user ?? null;
  }
}
