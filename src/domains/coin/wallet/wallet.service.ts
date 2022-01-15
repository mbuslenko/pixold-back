import { HttpException, Injectable } from '@nestjs/common';

import * as stellar from '../../../common/stellar';
import { accountTypeIsNotSupported } from '../../../common/consts/http-error-messages';

import { WalletRepository } from './persistance/wallet.repository';
import { ConnectWalletDto } from '../../../api/wallet/dto/wallet.dto';

@Injectable()
export class WalletService {
  constructor(private readonly walletRepository: WalletRepository) {}

  async connectWallet(props: ConnectWalletDto) {
    const accountInfo = await stellar
      .getAccountInfo(props.publicKey)
      .catch((e) => {
        if (e.status === 404) {
          throw new HttpException(
            { message: 'To connect a wallet, you must have a balance on it' },
            400,
          );
        } else {
          throw e;
        }
      });

    for (const [key, value] of Object.entries(accountInfo.rawData.flags)) {
      if (value === true) {
        throw new HttpException(accountTypeIsNotSupported, 400);
      }
    }

    const row = await this.walletRepository.findOne({
      publicKey: props.publicKey,
    });

    if (!row) {
      await this.walletRepository.delete({ ownerId: props.userId });

      const wallet = await this.walletRepository.save(
        this.walletRepository.create({
          publicKey: props.publicKey,
          secretKey: props.secret,
          ownerId: props.userId,
          ...accountInfo,
        }),
      );

      return {
        id: wallet.id,
        balanceInUSD: wallet.balanceInUSD,
        balanceInXLM: wallet.balanceInXLM,
        balanceInPXL: wallet.balanceInPXL,
      };
    } else {
      throw new HttpException({ message: 'Wallet already exists' }, 400);
    }
  }

  async getWallet(userId: string, throwError: boolean) {
    const [wallet] = await this.walletRepository.getWallet(userId);

    if (!wallet) {
      if (throwError) {
        throw new HttpException({ message: 'Wallet not found' }, 400);
      }

      return null;
    }

    return {
      username: wallet.username,
      balanceInUSD: wallet.balance_in_usd,
      balanceInXLM: wallet.balance_in_xlm,
      balanceInPXL: wallet.balance_in_pxl,
    };
  }

  async getPixoldCoinsLeft() {
    return this.walletRepository
      .findOne({ where: { ownerId: 'bf0fbe8d-1dc3-4ffa-a967-8131feaff6d3' } })
      .then((response) => {
        return response.balanceInPXL;
      });
  }
}
