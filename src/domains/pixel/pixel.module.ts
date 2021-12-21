import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PixelRepository } from './persistance/pixel.repository';

import { PixelDomain } from './pixel.domain';
import { PixelService } from './services/pixel.service';
import { PixelSyncService } from './services/pixel.sync.service';

@Module({
  imports: [TypeOrmModule.forFeature([PixelRepository])],
  providers: [PixelDomain, PixelService, PixelSyncService],
})
export class PixelModule {}
