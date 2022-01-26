import { Column } from 'typeorm';
import { PixoldBaseEntity } from '../common/db/base-entity';

export class NotificationsEntity extends PixoldBaseEntity<NotificationsEntity> {
  @Column()
  userId: string;

  @Column()
  type: string;

  @Column({ name: 'last_notified_at', type: 'timestamp' })
  lastNotifiedAt: Date;
}
