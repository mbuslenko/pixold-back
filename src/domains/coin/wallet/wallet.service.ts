import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import * as stellar from '../../../common/stellar';
import { accountTypeIsNotSupported } from '../../../common/consts/http-error-messages';

import { WalletRepository } from './persistance/wallet.repository';
import { ConnectWalletDto } from '../../../api/wallet/dto/wallet.dto';
import { sendNotification } from '../../../common/utils/telegram-notifications';
import {
  sendTransactionToPixold,
  sendTransactionToUser,
} from '../../../common/stellar/transaction';
import { UserDomain } from '../../user/user.domain';

@Injectable()
export class WalletService {
  constructor(private readonly walletRepository: WalletRepository, private readonly userDomain: UserDomain) {}

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

      const user = await this.userDomain.getUserById(props.userId);

      return {
        username: user.username,
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
      .findOne({ where: { ownerId: '6370046c-ac93-4d19-a55f-c59c5d5211b3' } })
      .then((response) => {
        return response.balanceInPXL;
      });
  }

  async sendCoinsToUser(userId: string, coins: number): Promise<void> {
    const userWallet = await this.walletRepository.findOne({
      where: { ownerId: userId },
    });
    const [pixoldWallet] = await this.walletRepository.getWallet('6370046c-ac93-4d19-a55f-c59c5d5211b3');

    if (!userWallet) {
      throw new HttpException(
        { message: `You don't have wallet to send coins` },
        400,
      );
    }

    const newUserBalance = userWallet.balanceInPXL + coins;
    const newPixoldBalance = pixoldWallet.balance_in_pxl - coins;

    if (newPixoldBalance < 10000) {
      sendNotification(
        `@mbuslenko, @myroslavvv, There are less than 10,000 PXL left on Pixold`,
      );
    } else if (newPixoldBalance < 1000) {
      sendNotification(
        `@mbuslenko, @myroslavvv, There are less than 1,000 PXL left on Pixold`,
      );
    } else if (newPixoldBalance < 0) {
      throw new InternalServerErrorException({
        message: `Not enough coins in Pixold`,
      });
    }
 
    // ! TODO: Uncomment
    //sendTransactionToUser(userWallet.publicKey, coins.toString());

    await this.walletRepository.update(
      { id: userWallet.id },
      { balanceInPXL: newUserBalance },
    );
    await this.walletRepository.update(
      { ownerId: '6370046c-ac93-4d19-a55f-c59c5d5211b3' },
      { balanceInPXL: newPixoldBalance },
    );
  }

  async substractCoinsFromPixoldBalance(coins: number): Promise<void> {
    const pixoldWallet = await this.walletRepository.findOne({
      where: { ownerId: 'pixold' },
    });

    const newPixoldBalance = pixoldWallet.balanceInPXL - coins;

    if (newPixoldBalance < 10000) {
      sendNotification(
        `@mbuslenko, @myroslavvv, There are less than 10,000 PXL left on Pixold`,
      );
    } else if (newPixoldBalance < 1000) {
      sendNotification(
        `@mbuslenko, @myroslavvv, There are less than 1,000 PXL left on Pixold`,
      );
    } else if (newPixoldBalance < 0) {
      throw new InternalServerErrorException({
        message: `Not enough coins in Pixold`,
      });
    }

    await this.walletRepository.update(
      { id: pixoldWallet.id },
      { balanceInPXL: newPixoldBalance },
    );
  }

  async substractCoinsFromUserBalance(
    userId: string,
    coins: number,
  ): Promise<void> {
    const userWallet = await this.walletRepository.findOne({
      where: { ownerId: userId },
    });

    const newUserBalance = userWallet.balanceInPXL - coins;

    if (newUserBalance < 0) {
      throw new HttpException(
        { message: `Not enough coins in your wallet` },
        400,
      );
    }

    await this.walletRepository.update(
      { id: userWallet.id },
      { balanceInPXL: newUserBalance },
    );
  }

  async sendCoinsToPixold(userId: string, coins: number): Promise<void> {
    const userWallet = await this.walletRepository.findOne({
      where: { ownerId: userId },
    });
    const pixoldWallet = await this.walletRepository.findOne({
      where: { ownerId: '6370046c-ac93-4d19-a55f-c59c5d5211b3' },
    });

    if (!userWallet) {
      throw new HttpException(
        { message: `You don't have wallet to send coins` },
        400,
      );
    }

    const newUserBalance = userWallet.balanceInPXL - coins;
    const newPixoldBalance = pixoldWallet.balanceInPXL + coins;

    if (newUserBalance < 0) {
      throw new HttpException(
        { message: `Not enough coins in your wallet` },
        400,
      );
    }

    // ! TODO: Uncomment
    // sendTransactionToPixold(userWallet.secretKey, coins.toString());

    await this.walletRepository.update(
      { id: userWallet.id },
      { balanceInPXL: newUserBalance },
    );
    await this.walletRepository.update(
      { ownerId: '6370046c-ac93-4d19-a55f-c59c5d5211b3' },
      { balanceInPXL: newPixoldBalance },
    );
  }
}
