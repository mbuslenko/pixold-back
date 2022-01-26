import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PixoldAuthGuard } from '../../common/guards/auth.guard';
import { NotificationsDomain } from '../../domains/notifications/notifications.domain';
import { SubscribeToNotificationsDto } from './dto/notifications.dto';

@ApiTags('notifications')
@Controller('notifications')
export class NotifcationsController {
  constructor(private readonly notificationsDomain: NotificationsDomain) {}

  @ApiOperation({ summary: 'Subscribe to notifications' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { notificationsType: { type: 'string' } },
    },
  })
  @UseGuards(PixoldAuthGuard)
  @Post('/subscribe')
  async subscribeToNotifications(
    @Body() body: SubscribeToNotificationsDto,
    @CurrentUser() { uid }: any,
  ) {
    return this.notificationsDomain.subscribeToNotifications(
      uid,
      body.notificationsType,
    );
  }
}
