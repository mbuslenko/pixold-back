import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Param,
  Get,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiHeaders,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PixoldAuthGuard } from '../../common/guards/auth.guard';
import { UserDomain } from '../../domains/user/user.domain';
import { UserEntity } from '../../models';
import {
  CheckUsernameOkResponse,
  GetUserByIdOkResponse,
  UpdateUsernameDto,
} from './dto/user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userDomain: UserDomain) {}

  @ApiOperation({ summary: `Uppdate user's username` })
  @ApiCreatedResponse({ type: '' })
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'access token',
      required: true,
    },
  ])
  @ApiBody({ schema: { example: { username: 'string' } } })
  @UsePipes(new ValidationPipe())
  @UseGuards(PixoldAuthGuard)
  @Post('update/username')
  async updateUsername(
    @CurrentUser() { uid }: any,
    @Body() body: UpdateUsernameDto,
  ) {
    return this.userDomain.updateUsername(uid, body.username);
  }

  @ApiOperation({ summary: 'Check if username is free' })
  @ApiOkResponse({ type: CheckUsernameOkResponse })
  @ApiParam({ name: 'username' })
  @Get('check/username/:username')
  async checkUsername(@Param('username') username: string) {
    return this.userDomain.checkUsername(username);
  }

  @Get('me')
  @UseGuards(PixoldAuthGuard)
  @ApiOperation({ summary: 'Get current user' })
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'access token',
      required: true,
    },
  ])
  @ApiOkResponse({ type: GetUserByIdOkResponse })
  async getCurrentUser(@CurrentUser() { uid }: any) {
    return this.userDomain.getUserById(uid);
  }
}
