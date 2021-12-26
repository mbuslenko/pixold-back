import { Body, Controller, Get, HttpCode, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiProperty,
  ApiExcludeEndpoint,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { HttpErrorMessageType } from '../../common/consts/http-error-messages';
import { PixoldAuthGuard } from '../../common/guards/auth.guard';
import { CoinDomain } from '../../domains/coin/coin.domain';
import { ConnectWalletDto, ConnectWalletOkResponse } from './dto/wallet.dto';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(
    private readonly coinDomain: CoinDomain,
  ) {}

  @ApiOperation({ summary: 'Connect an existing stellar wallet' })
  @ApiCreatedResponse({ type: ConnectWalletOkResponse })
  @ApiBadRequestResponse({ type: HttpErrorMessageType })
  @ApiBody({ schema: { example: { userId: 'string', publicKey: 'string', secretKey: 'string' } } })
  @UseGuards(PixoldAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/connect')
   async connectWallet(@Body() props: ConnectWalletDto) {
     return this.coinDomain.connectWallet(props);
   }

  @Get('/:userId')
  async getWallet(
    @Param('userId') userId: string
  ) {
    return this.coinDomain.getWallet(userId);
  }
}
