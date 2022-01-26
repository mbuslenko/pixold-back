import { EntityRepository, Repository } from 'typeorm';
import { NotificationsEntity } from '../../../models';

@EntityRepository(NotificationsEntity)
export class NotificationsRepository extends Repository<NotificationsEntity> {
  async subscribeToNotifications(userId: string, notificationType: string) {
    return this.createQueryBuilder()
      .insert()
      .values({
        userId,
        type: notificationType,
      })
      .orIgnore();
  }
}
