import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiProperty,
  ApiExcludeEndpoint,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiHeaders,
} from '@nestjs/swagger';

import { HttpErrorMessageType } from '../../common/consts/http-error-messages';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PixoldAuthGuard } from '../../common/guards/auth.guard';
import { CoinDomain } from '../../domains/coin/coin.domain';
import {
  ConnectWalletDto,
  ConnectWalletOkResponse,
  GetWalletOkResponse,
} from './dto/wallet.dto';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly coinDomain: CoinDomain) {}

  @ApiOperation({ summary: 'Connect an existing stellar wallet' })
  @ApiCreatedResponse({ type: ConnectWalletOkResponse })
  @ApiBadRequestResponse({ type: HttpErrorMessageType })
  @ApiBody({
    schema: {
      example: { userId: 'string', publicKey: 'string', secret: 'string' },
    },
  })
  @UseGuards(PixoldAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/connect')
  async connectWallet(@Body() props: ConnectWalletDto) {
    return this.coinDomain.connectWallet(props);
  }

  @ApiOperation({ summary: `Get user's wallet` })
  @ApiOkResponse({ type: GetWalletOkResponse })
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'access token',
      required: true,
    },
  ])
  @UseGuards(PixoldAuthGuard)
  @Get()
  async getWallet(@CurrentUser() { uid }: any) {
    return this.coinDomain.getWallet(uid, true);
  }
}
