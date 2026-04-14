import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEaNumber(eaNumber: string): Promise<User | null> {
    return this.repository.findOne({ where: { eaNumber } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findByIdentifier(identifier: string): Promise<User | null> {
    // Try EA number first (starts with EA), then email
    if (identifier.toUpperCase().startsWith('EA')) {
      const user = await this.findByEaNumber(identifier.toUpperCase());
      if (user) return user;
    }
    // Try email
    return this.findByEmail(identifier.toLowerCase());
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async softDelete(id: number): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return (result.affected ?? 0) > 0;
  }

  async findAndCount(page = 1, limit = 20): Promise<[User[], number]> {
    return this.repository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findByRole(role: string, page = 1, limit = 20): Promise<[User[], number]> {
    return this.repository.findAndCount({
      where: { role: role as any },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
