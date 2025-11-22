import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('notification_in_app_notifications')
// ⚡ Performance Index: Optimization for "Get my notifications, newest first"
@Index('idx_user_notifications', ['userId', 'createdAt'])
// ⚡ Performance Index: Optimization for "Count my unread badge"
@Index('idx_user_unread', ['userId'], { where: '"is_read" = false' })
export class InAppNotification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'event_type', type: 'varchar', length: 50 })
  eventType: string;

  @Column('text')
  title: string;

  @Column('text')
  body: string;

  // The deep link, e.g., '/bookings/bk_123'
  @Column({ name: 'action_link', type: 'text', nullable: true })
  actionLink: string | null;

  // 🧠 The flexible part: Store booking_id, movie_id, etc. here without migrations.
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Column({ name: 'read_at', type: 'timestamp with time zone', nullable: true })
  readAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;
}
