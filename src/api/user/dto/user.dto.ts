import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class UpdateUsernameDto {
    @IsString()
    username: string;
}

export class CheckUsernameOkResponse {
    @ApiProperty()
    result: boolean
}