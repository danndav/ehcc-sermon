import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';
import { RoleEnum } from '../enums/role.enum';

@Entity('users')
export class User extends IEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', nullable: true, name: 'avatar_url' })
  avatarUrl: string | null;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.MEMBER })
  role: RoleEnum;

  @Column({ type: 'varchar', nullable: true })
  refreshToken: string | null;

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ type: 'boolean', default: false })
  isSuspended: boolean;
}
