import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { RoleEnum } from '../../domain/enums/role.enum';

@Injectable()
export class UserAdminService {
  constructor(private readonly userRepository: UserRepository) {}

  async listUsers(page = 1, limit = 20, options?: { search?: string; role?: string }): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.userRepository.findAndCount(page, limit, options);
    return { users, total };
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User not found: ${id}`);
    }
    return user;
  }

  async updateRole(id: number, role: RoleEnum): Promise<User> {
    const user = await this.getUserById(id);
    const updated = await this.userRepository.update(user.id, { role });
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async setRoleByEaNumber(eaNumber: string, role: RoleEnum): Promise<User> {
    const user = await this.userRepository.findByEaNumber(eaNumber.toUpperCase());
    if (!user) throw new NotFoundException(`User with EA number ${eaNumber} not found`);
    const updated = await this.userRepository.update(user.id, { role });
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async suspendUser(id: number): Promise<User> {
    const user = await this.getUserById(id);
    const updated = await this.userRepository.update(user.id, { isSuspended: true });
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async unsuspendUser(id: number): Promise<User> {
    const user = await this.getUserById(id);
    const updated = await this.userRepository.update(user.id, { isSuspended: false });
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }
}
