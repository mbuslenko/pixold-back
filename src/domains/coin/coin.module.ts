import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinDomain } from './coin.domain';
import { WalletRepository } from './wallet/persistance/wallet.repository';
import { WalletService } from './wallet/wallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([WalletRepository])],
  providers: [CoinDomain, WalletService],
  exports: [CoinDomain],
})
export class CoinModule {}
