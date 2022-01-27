import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class SubscribeToNotificationsDto {
  @IsString()
  @IsNotEmpty()
  notificationsType: string;

  @IsBoolean()
  subscribe: boolean;
}
