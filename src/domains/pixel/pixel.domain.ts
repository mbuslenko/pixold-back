import { Injectable } from '@nestjs/common';
import { GameService } from './services/game.service';

import { PixelService } from './services/pixel.service';

@Injectable()
export class PixelDomain {
  constructor(
    private readonly pixelService: PixelService,
    private readonly gameService: GameService,
  ) {}

  async getAllPixels() {
    return this.pixelService.getAllPixels();
  }

  async redeemCode(userId: string, code: string) {
    return this.pixelService.redeemCode(userId, code);
  }

  async miningCron() {
    return this.gameService.miningCron();
  }
}
