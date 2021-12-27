import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiHeaders,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PixoldAuthGuard } from '../../common/guards/auth.guard';

import { PixelDomain } from '../../domains/pixel/pixel.domain';
import { GetAllPixelsOkResponse, RedeemCodeDto } from './dto/pixel.dto';

@ApiTags('pixel')
@Controller('pixel')
export class PixelController {
  constructor(private readonly pixelDomain: PixelDomain) {}

  @UseGuards(PixoldAuthGuard)
  @ApiOperation({ summary: 'Get whole pixels map' })
  @ApiOkResponse({ type: GetAllPixelsOkResponse })
  @Get('/all')
  async getAllPixels() {
    return this.pixelDomain.getAllPixels();
  }

  @ApiOperation({ summary: 'Redeem code to get pixel' })
  @ApiCreatedResponse({ type: '' })
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'access token',
      required: true,
    },
  ])
  @ApiBody({ schema: { example: { code: 'string' } } })
  @UseGuards(PixoldAuthGuard)
  @Post('/redeem')
  async redeemCode(@CurrentUser() { uid }: any, @Body() body: RedeemCodeDto) {
    return this.pixelDomain.redeemCode(uid, body.code);
  }
}
