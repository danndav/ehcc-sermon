import { RoleEnum } from '../enums/role.enum';

export interface UserReadModel {
  id: number;
  eaNumber: string | null;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
  role: RoleEnum;
  isVerified: boolean;
  isSuspended: boolean;
  passwordSet: boolean;
  branchId: number | null;
  createdAt: Date;
  updatedAt: Date;
}
