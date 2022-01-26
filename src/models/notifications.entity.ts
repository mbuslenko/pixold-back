import { Column, Entity, Unique } from 'typeorm';
import { PixoldBaseEntity } from '../common/db/base-entity';

@Entity({ name: 'notifications' })
@Unique('notification_type_user_id', ['type', 'userId'])
export class NotificationsEntity extends PixoldBaseEntity<NotificationsEntity> {
  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  type: string;

  @Column({ name: 'last_notified_at', type: 'timestamp' })
  lastNotifiedAt: Date;
}
