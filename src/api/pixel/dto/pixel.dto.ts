import { ApiProperty } from '@nestjs/swagger';

export class GetAllPixelsOkResponse {
  @ApiProperty()
  numericId: number;

  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  color: string;
}
