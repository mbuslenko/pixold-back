import { Injectable } from '@nestjs/common';

import { ConnectWalletDto } from '../../api/wallet/dto/wallet.dto';
import { CoinService } from './coin/coin.service';
import { WalletService } from './wallet/wallet.service';

@Injectable()
export class CoinDomain {
  constructor(
    private readonly walletService: WalletService,
    private readonly coinService: CoinService,
  ) {}

  async connectWallet(props: ConnectWalletDto) {
    return this.walletService.connectWallet(props);
  }

  async getWallet(userId: string, throwError: boolean) {
    return this.walletService.getWallet(userId, throwError);
  }

  async getPixoldCoinsLeft() {
    return this.walletService.getPixoldCoinsLeft();
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

  async substractCoinsFromPixoldBalance(coins: number) {
    return this.walletService.substractCoinsFromPixoldBalance(coins);
  }

  async substractCoinsFromUserBalance(userId: string, coins: number) {
    return this.walletService.substractCoinsFromUserBalance(userId, coins);
  }
}
