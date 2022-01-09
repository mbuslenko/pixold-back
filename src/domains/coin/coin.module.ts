import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinDomain } from './coin.domain';
import { CoinService } from './coin/coin.service';
import { WalletRepository } from './wallet/persistance/wallet.repository';
import { WalletService } from './wallet/wallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([WalletRepository])],
  providers: [CoinDomain, WalletService, CoinService],
  exports: [CoinDomain],
})
export class CoinModule {}
