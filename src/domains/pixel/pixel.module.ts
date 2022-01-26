import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from '../../events/events.module';
import { CoinModule } from '../coin/coin.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UserModule } from '../user/user.module';

import { PixelRepository } from './persistance/pixel.repository';
import { AttackPixelRepository } from './persistance/types/attack-pixel.repository';
import { DefenderPixelRepository } from './persistance/types/defender-pixel.repository';
import { MinerPixelRepository } from './persistance/types/miner-pixel.repository';

import { PixelDomain } from './pixel.domain';
import { GameService } from './services/game.service';
import { PixelService } from './services/pixel.service';
import { PixelSyncService } from './services/pixel.sync.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PixelRepository,
      MinerPixelRepository,
      AttackPixelRepository,
      DefenderPixelRepository,
    ]),
    CoinModule,
    UserModule,
    EventsModule,
    NotificationsModule,
  ],
  providers: [PixelDomain, PixelService, PixelSyncService, GameService],
  exports: [PixelDomain],
})
export class PixelModule {}
