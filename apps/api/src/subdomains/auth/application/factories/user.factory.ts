import { User } from '../../domain/entities/user.entity';
import { UserReadModel } from '../../domain/read-models/user.read-model';

export class UserFactory {
  static toReadModel(user: User): UserReadModel {
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
