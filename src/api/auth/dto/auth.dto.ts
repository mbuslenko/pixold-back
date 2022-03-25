import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { GetWalletOkResponse } from '../../wallet/dto/wallet.dto';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  avatarUrl: string;

  @IsString()
  @IsNotEmpty()
  accessToken: string

  @IsString()
  @IsIn(['google', 'facebook'])
  platform: 'google' | 'facebook'
}

export class AuthResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  updateUsername: boolean;

  @ApiProperty()
  username: string;

  @ApiProperty()
  wallet: GetWalletOkResponse | null;
}
