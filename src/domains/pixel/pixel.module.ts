import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinModule } from '../coin/coin.module';
import { UserModule } from '../user/user.module';

import { PixelRepository } from './persistance/pixel.repository';
import { MinerPixelRepository } from './persistance/types/miner-pixel.repository';

import { PixelDomain } from './pixel.domain';
import { GameService } from './services/game.service';
import { PixelService } from './services/pixel.service';
import { PixelSyncService } from './services/pixel.sync.service';

@Module({
  imports: [TypeOrmModule.forFeature([PixelRepository, MinerPixelRepository]), CoinModule, UserModule],
  providers: [PixelDomain, PixelService, PixelSyncService, GameService,],
  exports: [PixelDomain],
})
export class PixelModule {}
