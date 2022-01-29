import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from '../../events/events.module';
import { NotificationsDomain } from './notifications.domain';
import { NotificationsRepository } from './persistance/notifications.repository';
import { NotificationsService } from './services/notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationsRepository]), EventsModule],
  providers: [NotificationsDomain, NotificationsService],
  exports: [NotificationsDomain],
})
export class NotificationsModule {}
