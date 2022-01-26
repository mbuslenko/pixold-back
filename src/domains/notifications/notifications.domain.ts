import { Injectable } from '@nestjs/common';
import { NotificationsService } from './services/notifications.service';

@Injectable()
export class NotificationsDomain {
  constructor(private readonly notificationsService: NotificationsService) {}

  async subscribeToNotifications(userId: string, notificationType: string) {
    return this.notificationsService.subscribeToNotifications(
      userId,
      notificationType,
    );
  }

  async checkIsNotSubscribed(userId: string, notificationType: string) {
    return this.notificationsService.checkIsNotSubscribed(
      userId,
      notificationType,
    );
  }
}
