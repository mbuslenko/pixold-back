import { Injectable } from '@nestjs/common';
import { SendInfoNotificationDto } from '../../api/notifications/dto/notifications.dto';
import { NotificationsService } from './services/notifications.service';

@Injectable()
export class NotificationsDomain {
  constructor(private readonly notificationsService: NotificationsService) {}

  async subscribeToNotifications(
    userId: string,
    notificationType: string,
    subscribe: boolean,
  ) {
    return this.notificationsService.subscribeToNotifications(
      userId,
      notificationType,
      subscribe,
    );
  }

  async checkIsNotSubscribed(userId: string, notificationType: string) {
    return this.notificationsService.checkIsNotSubscribed(
      userId,
      notificationType,
    );
  }

  async sendInfoMessage(props: SendInfoNotificationDto) {
    return this.notificationsService.sendInfoNotificationToUsers(props);
  }
}
