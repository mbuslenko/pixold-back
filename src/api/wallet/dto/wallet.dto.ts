import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectWalletDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string

  @IsString()
  @IsNotEmpty()
  publicKey: string;

  @IsString()
  @IsNotEmpty()
  secret: string;
}

export class ConnectWalletOkResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  balanceInUSD: number;

  @ApiProperty()
  balanceInXLM: number;
}