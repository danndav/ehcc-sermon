import { RoleEnum } from '../enums/role.enum';

export interface UserReadModel {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: RoleEnum;
  isEmailVerified: boolean;
  isSuspended: boolean;
  createdAt: Date;
  updatedAt: Date;
}
