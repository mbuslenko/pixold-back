import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
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

import { PixelDomain } from '../../domains/pixel/pixel.domain';
import {
  AttackHexagonDto,
  ChangeHexagonTypeDto,
  GetAllPixelsOkResponse,
  GetAllPixelsOwnedByUsersOkResponse,
  HexagonInfoOkResponse,
  OneFreeHexagonOkResponse,
  RedeemCodeDto,
  UpgradeHexagonDto,
} from './dto/pixel.dto';

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

  @UseGuards(PixoldAuthGuard)
  @ApiOperation({ summary: 'Get all pixels owned by users' })
  @ApiHeaders([
    { name: 'Authorization', description: 'access tokn', required: true },
  ])
  @ApiOkResponse({ type: [GetAllPixelsOwnedByUsersOkResponse] })
  @Get('/all/owned')
  async getAllPixelsOwnedByUsers() {
    return this.pixelDomain.getAllPixelsOwnedByUsers();
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

  @ApiOperation({ summary: 'for technical reasons' })
  @Get('/cron/mining')
  miningCron() {
    return this.pixelDomain.miningCron();
  }

  @ApiOperation({ summary: 'Get one free hexagon' })
  @ApiOkResponse({ type: OneFreeHexagonOkResponse })
  @Get('one-free')
  getOneFreeHexagon() {
    return this.pixelDomain.getRandomFreeHexagon();
  }

  @ApiOperation({ summary: 'Get hexagon info' })
  @ApiParam({ name: 'numericId', description: 'hexagon numeric id' })
  @ApiHeaders([
    { name: 'Authorization', description: 'access token', required: true },
  ])
  @ApiOkResponse({ type: HexagonInfoOkResponse })
  @UseGuards(PixoldAuthGuard)
  @Get('/:numericId')
  async getHexagonInfo(
    @CurrentUser() { uid }: any,
    @Param('numericId') numericId: number,
  ) {
    return this.pixelDomain.getHexagonInfo(numericId, uid);
  }

  @HttpCode(201)
  @ApiOperation({ summary: 'Change hexagon type' })
  @ApiBody({
    schema: {
      example: { numericId: 'number', type: `'attack' | 'miner' | 'defender'` },
    },
  })
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'access token',
      required: true,
    },
  ])
  @ApiCreatedResponse()
  @UseGuards(PixoldAuthGuard)
  @Post('/change-type')
  async changeHexagonType(
    @CurrentUser() { uid }: any,
    @Body() body: ChangeHexagonTypeDto,
  ) {
    return this.pixelDomain.changeHexagonType(body.numericId, body.type, uid);
  }

  @HttpCode(200)
  @UseGuards(PixoldAuthGuard)
  @ApiOperation({ summary: 'Attack hexagon' })
  @ApiBody({ schema: { example: { from: 228, to: 1337 } } })
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'access token',
      required: true,
    },
  ])
  @Post('/attack')
  async attackHexagon(
    @CurrentUser() { uid }: any,
    @Body() body: AttackHexagonDto,
  ) {
    return this.pixelDomain.attackHexagon(uid, body);
  }

  @HttpCode(200)
  @UseGuards(PixoldAuthGuard)
  @ApiOperation({ summary: 'Upgrade hexagon' })
  @ApiBody({ schema: { example: { numericId: 228 } } })
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'access token',
      required: true,
    },
  ])
  @Post('/upgrade')
  async upgradeHexagon(
    @CurrentUser() { uid }: any,
    @Body() body: UpgradeHexagonDto,
  ) {
    return this.pixelDomain.upgradeHexagon(uid, body.numericId);
  }

  @Post('/buy')
  async buyHexagon(@Body() body: any) {
    return this.pixelDomain.buyHexagon(body.userId, body.numericId);
  }
}
