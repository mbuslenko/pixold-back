import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PixelLevelsEnum } from '../../../common/consts/level.enum';

export class GetAllPixelsOkResponse {
  @ApiProperty()
  numericId: number;

  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  color: string;
}

export class GetAllPixelsOwnedByUsersOkResponse {
  @ApiProperty()
  username: number;
}

export class RedeemCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class OneFreeHexagonOkResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  bid: string;

  @ApiProperty()
  purchaseLink: string;
}

export class HexagonInfoOkResponse {
  @ApiProperty({
    type: 'string',
    enum: ['attack', 'miner', 'defender', 'without'],
  })
  type: 'attack' | 'miner' | 'defender' | 'without';

  @ApiProperty({
    type: 'string',
    enum: ['starter', 'middle', 'pro', 'supreme'],
  })
  level: PixelLevelsEnum;

  @ApiProperty()
  coinsInStorage: number;

  @ApiProperty()
  owner: string;

  @ApiProperty()
  canAttack: boolean;

  @ApiProperty()
  coinsToUpgrade: number;
}

export class ChangeHexagonTypeDto {
  @IsString()
  @IsEnum(['attack', 'miner', 'defender'])
  @IsNotEmpty()
  type: 'attack' | 'miner' | 'defender';

  @IsNumber()
  @IsNotEmpty()
  numericId: number;

}

export class AttackHexagonDto {
  @IsNumber()
  @IsNotEmpty()
  from: number;

  @IsNumber()
  @IsNotEmpty()
  to: number;
}

export class UpgradeHexagonDto {
  @IsNumber()
  @IsNotEmpty()
  numericId: number;
}
