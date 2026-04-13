import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';

@Entity('pastors')
export class Pastor extends IEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'photo_url' })
  photoUrl: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'church_role' })
  churchRole: string | null;
}
