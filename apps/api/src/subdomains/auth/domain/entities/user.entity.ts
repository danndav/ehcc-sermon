import { Column, Entity, DeleteDateColumn, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEnum } from '../enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'ea_number' })
  eaNumber: string | null;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'phone_number' })
  phoneNumber: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'password_hash' })
  passwordHash: string | null;

  @Column({ type: 'boolean', default: false, name: 'password_set' })
  passwordSet: boolean;

  @Column({ type: 'varchar', length: 50, default: RoleEnum.MEMBER })
  role: RoleEnum;

  @Column({ type: 'varchar', nullable: true, name: 'avatar_url' })
  avatarUrl: string | null;

  @Column({ type: 'text', nullable: true, name: 'refresh_token' })
  refreshToken: string | null;

  @Column({ type: 'boolean', default: false, name: 'is_verified' })
  isVerified: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_suspended' })
  isSuspended: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_staff' })
  isStaff: boolean;

  @Column({ type: 'varchar', nullable: true })
  department: string | null;

  @Column({ type: 'varchar', nullable: true })
  directorate: string | null;

  @Column({ type: 'varchar', nullable: true })
  gender: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'marital_status' })
  maritalStatus: string | null;

  @Column({ type: 'varchar', nullable: true })
  designation: string | null;

  @Column({ type: 'boolean', default: false })
  express: boolean;

  @Column({ type: 'int', nullable: true, name: 'branch_id' })
  branchId: number | null;

  @Column({ type: 'timestamp', nullable: true, name: 'last_login_at' })
  lastLoginAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}
