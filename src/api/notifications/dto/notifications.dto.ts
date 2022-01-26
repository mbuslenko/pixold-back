import { IsNotEmpty, IsString } from 'class-validator';

export class SubscribeToNotificationsDto {
  @IsString()
  @IsNotEmpty()
  notificationsType: string;
}
