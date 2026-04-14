import { Injectable } from '@nestjs/common';
import { UserReadModel } from '../../domain/read-models/user.read-model';
import { UserReadRepository } from '../../infrastructure/repositories/read/user.read-repository';

@Injectable()
export class IamService {
  constructor(
    private readonly userReadRepository: UserReadRepository,
  ) {}

  async findUserByEmail(email: string): Promise<UserReadModel | null> {
    return this.userReadRepository.findByEmail(email);
  }

  async findUserByEaNumber(eaNumber: string): Promise<UserReadModel | null> {
    return this.userReadRepository.findByEaNumber(eaNumber);
  }
}
