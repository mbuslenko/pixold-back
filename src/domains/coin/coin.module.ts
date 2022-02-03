import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WalletRepository } from './wallet/persistance/wallet.repository';

import { CoinDomain } from './coin.domain';
import { CoinService } from './coin/coin.service';
import { WalletService } from './wallet/wallet.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([WalletRepository]), UserModule],
  providers: [CoinDomain, WalletService, CoinService],
  exports: [CoinDomain],
})
export class CoinModule {}
