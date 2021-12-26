import { Injectable } from '@nestjs/common';

import { ConnectWalletDto } from '../../api/wallet/dto/wallet.dto';
import { WalletService } from './wallet/wallet.service';

@Injectable()
export class CoinDomain {
  constructor(
    private readonly walletService: WalletService,
  ) {}

  async connectWallet(props: ConnectWalletDto) {
    return this.walletService.connectWallet(props);
  }

  async getWallet(userId: string) {
    return this.walletService.getWallet(userId);
  }
}
