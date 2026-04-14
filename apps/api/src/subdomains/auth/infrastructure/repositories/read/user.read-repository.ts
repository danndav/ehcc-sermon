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
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return null;
    return this.toReadModel(user);
  }

  async findByEaNumber(eaNumber: string): Promise<UserReadModel | null> {
    const user = await this.userRepository.findOne({ where: { eaNumber } });
    if (!user) return null;
    return this.toReadModel(user);
  }

  private toReadModel(user: User): UserReadModel {
    return {
      id: user.id,
      eaNumber: user.eaNumber,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      avatarUrl: user.avatarUrl,
      role: user.role,
      isVerified: user.isVerified,
      isSuspended: user.isSuspended,
      passwordSet: user.passwordSet,
      branchId: user.branchId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
