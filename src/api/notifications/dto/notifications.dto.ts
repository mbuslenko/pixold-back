import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class SubscribeToNotificationsDto {
  @IsString()
  @IsNotEmpty()
  notificationsType: string;

  @IsBoolean()
  subscribe: boolean;
}

export class SendInfoNotificationDto {
  @IsString()
  @IsNotEmpty()
  securityToken: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}