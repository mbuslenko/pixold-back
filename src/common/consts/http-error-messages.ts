import { ApiProperty } from '@nestjs/swagger';

export class HttpErrorMessageType {
  @ApiProperty()
  message: string
}

export const accountTypeIsNotSupported = {
  message: `We don't support this type of accounts`,
}
