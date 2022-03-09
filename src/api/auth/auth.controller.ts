import { Body, Controller, HttpCode, Post, Request } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDomain } from '../../domains/user/user.domain';
import { AuthDto, AuthResponseDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userDomain: UserDomain) {}

  @ApiOperation({ summary: 'Authorize the user' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiBody({
    schema: {
      example: {
        email: 'string',
        firstName: 'string',
        lastName: 'string, optional',
        avatarUrl: 'string',
      },
    },
  })
  @HttpCode(200)
  @Post()
  async authenticate(@Body() body: AuthDto, @Request() req: any) {
    return this.userDomain.authenticate(body, req.remoteAddress);
  }
}
