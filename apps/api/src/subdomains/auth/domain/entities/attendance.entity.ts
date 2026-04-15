import { Column, Entity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({ type: 'int', nullable: true, name: 'branch_id' })
  branchId: number | null;

  @Column({ type: 'decimal', nullable: true })
  latitude: number | null;

  @Column({ type: 'decimal', nullable: true })
  longitude: number | null;

  @Column({ type: 'timestamp', default: () => 'now()', name: 'clocked_in_at' })
  clockedInAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'clocked_out_at' })
  clockedOutAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}
