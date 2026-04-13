import { User } from '../../domain/entities/user.entity';
import { UserReadModel } from '../../domain/read-models/user.read-model';
import { RoleEnum } from '../../domain/enums/role.enum';

export interface RegisterUserDto {
  name: string;
  email: string;
}

export class UserFactory {
  static createMember(dto: RegisterUserDto, passwordHash: string): User {
    const user = new User();
    user.name = dto.name;
    user.email = dto.email;
    user.passwordHash = passwordHash;
    user.role = RoleEnum.MEMBER;
    return user;
  }

  static toReadModel(user: User): UserReadModel {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isSuspended: user.isSuspended,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
