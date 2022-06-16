import { Injectable } from '@nestjs/common';

import { UserIdDto } from '../../api/wallet/dto/wallet.dto';
import { CoinService } from './coin/coin.service';
import { WalletService } from './wallet/wallet.service';

@Injectable()
export class CoinDomain {
  constructor(
    private readonly walletService: WalletService,
    private readonly coinService: CoinService,
  ) {}

  async generateWallet(props: UserIdDto) {
    return this.walletService.generateWallet(props);
  }

  async getWallet(props: UserIdDto, throwError: boolean) {
    return this.walletService.getWallet(props, throwError);
  }

  async getAmountInCoins(amountInUsd: number) {
    return this.coinService.getAmountInCoins(amountInUsd);
  }

  async sendCoinsToUser(userId: string, coins: number) {
    return this.walletService.sendCoinsToUser(userId, coins);
  }

  async sendCoinsToPixold(userId: string, coins: number) {
    return this.walletService.sendCoinsToPixold(userId, coins);
  }
}
