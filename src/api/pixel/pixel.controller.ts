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
import { GetAllPixelsOkResponse, OneFreeHexagonOkResponse, RedeemCodeDto } from './dto/pixel.dto';

@ApiTags('hexagon')
@Controller('hexagon')
export class PixelController {
  constructor(private readonly pixelDomain: PixelDomain) {}

  @UseGuards(PixoldAuthGuard)
  @ApiOperation({ summary: 'Get whole hexagons map' })
  @ApiOkResponse({ type: GetAllPixelsOkResponse })
  @Get('/all')
  async getAllPixels() {
    return this.pixelDomain.getAllPixels();
  }

  @ApiOperation({ summary: 'Redeem code to get hexagon' })
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

  @Get('/cron/mining')
  miningCron() {
    return this.pixelDomain.miningCron();
  }

  @ApiOperation({ summary: 'Get one free hexagon' })
  @ApiOkResponse({ type: OneFreeHexagonOkResponse })
  @Get('one-free')
  getOneFreeHexagon() {
    return {
      name: 'hexagon#567',
      bid: '100$',
      purchaseLink: 'https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/53812526196032344565437183040714628674999174739090954850032801003187019448321'
    }
  }
}
