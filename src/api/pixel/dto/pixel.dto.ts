import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetAllPixelsOkResponse {
  @ApiProperty()
  numericId: number;

  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  color: string;
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
