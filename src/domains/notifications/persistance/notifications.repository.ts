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
      return this
        .save(
          this.create({
            userId,
            type: notificationType,
            lastNotifiedAt: new Date(),
          })
        )
    } else {
      return this.delete({ userId, type: notificationType });
    }
  }
}
