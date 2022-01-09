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

  async getWallet(userId: string) {
    return this.walletService.getWallet(userId);
  }

  async getPixoldCoinsLeft() {
    return this.walletService.getPixoldCoinsLeft();
  }

  async getAmountInCoins(amountInUsd: number) {
    return this.coinService.getAmountInCoins(amountInUsd);
  }
}
