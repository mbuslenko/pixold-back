import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUsernameDto {
  @IsString()
  username: string;
}

export class CheckUsernameOkResponse {
  @ApiProperty()
  result: boolean;
}

export class GetUserByIdOkResponse {
  @ApiProperty()
  username: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  wallet: string;
}
