import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from '../persistance/notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  // TODO: change notificationType to UNION
  async subscribeToNotifications(userId: string, notificationType: string) {
    return this.notificationsRepository.subscribeToNotifications(
      userId,
      notificationType,
    );
  }

  async checkIsNotSubscribed(
    userId: string,
    notificationType: string,
  ): Promise<boolean> {
    const row = await this.notificationsRepository.findOne({
      userId,
      type: notificationType,
    });
    return !row;
  }
}
