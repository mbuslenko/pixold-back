import { EntityRepository, Repository } from 'typeorm';
import { NotificationsEntity } from '../../../models';

@EntityRepository(NotificationsEntity)
export class NotificationsRepository extends Repository<NotificationsEntity> {
  async subscribeToNotifications(
    userId: string,
    notificationType: string,
    subscribe: boolean,
  ) {
    if (subscribe === true) {
      return this.createQueryBuilder()
        .insert()
        .values([{
          userId,
          type: notificationType,
        }])
        .orIgnore();
    } else {
      return this.createQueryBuilder()
        .delete()
        .from(NotificationsEntity)
        .where({
          userId,
          type: notificationType,
        });
    }
  }
}
