import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SendInfoNotificationDto } from '../../../api/notifications/dto/notifications.dto';
import { NOTIFICATIONS_SECURITY_TOKEN } from '../../../config';
import { EventsGateway } from '../../../events/events.gateway';
import { NotificationsRepository } from '../persistance/notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly eventsGateWay: EventsGateway,
  ) {}

  // TODO: change notificationType to UNION
  async subscribeToNotifications(
    userId: string,
    notificationType: string,
    subscribe: boolean,
  ) {
    return this.notificationsRepository.subscribeToNotifications(
      userId,
      notificationType,
      subscribe,
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

  async sendInfoNotificationToUsers(props: SendInfoNotificationDto) {
    if (props.securityToken != NOTIFICATIONS_SECURITY_TOKEN) {
      throw new UnauthorizedException('Security token is invalid');
    }

    return this.eventsGateWay.sendInfoMessage({ title: props.title, body: props.body });
  }
}
