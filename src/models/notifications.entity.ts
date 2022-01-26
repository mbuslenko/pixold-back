import { Column, Entity } from 'typeorm';
import { PixoldBaseEntity } from '../common/db/base-entity';

@Entity({ name: 'notifications' })
export class NotificationsEntity extends PixoldBaseEntity<NotificationsEntity> {
  @Column()
  userId: string;

  @Column()
  type: string;

  @Column({ name: 'last_notified_at', type: 'timestamp' })
  lastNotifiedAt: Date;
}
