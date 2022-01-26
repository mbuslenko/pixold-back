import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsDomain } from './notifications.domain';
import { NotificationsRepository } from './persistance/notifications.repository';
import { NotificationsService } from './services/notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationsRepository])],
  providers: [NotificationsDomain, NotificationsService],
  exports: [NotificationsDomain],
})
export class NotificationsModule {}
