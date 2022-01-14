import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
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
}

export class AuthResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  updateUsername: boolean;

  @ApiProperty()
  wallet: GetWalletOkResponse | null;
}
