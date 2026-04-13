import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';

@Entity('discount_codes')
export class DiscountCode extends IEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'int', name: 'discount_percent' })
  discountPercent: number;

  @Column({ type: 'int', nullable: true, name: 'max_uses' })
  maxUses: number | null;

  @Column({ type: 'int', default: 0, name: 'used_count' })
  usedCount: number;

  @Column({ type: 'timestamp', nullable: true, name: 'expires_at' })
  expiresAt: Date | null;
}
