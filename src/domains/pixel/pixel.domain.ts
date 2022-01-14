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

  async getAllPixelsOwnedByUsers() {
    return this.pixelService.getAllPixelsOwnedByUsers();
  }

  async redeemCode(userId: string, code: string) {
    return this.pixelService.redeemCode(userId, code);
  }

  async miningCron() {
    return this.gameService.miningCron();
  }

  async getHexagonInfo(numericId: number, userId: string) {
    return this.pixelService.getHexagonInfo(numericId, userId);
  }

  async changeHexagonType(numericId: number, type: 'attack' | 'miner' | 'defender', userId: string) {
    return this.pixelService.changeType(numericId, type, userId);
  }

  async getRandomFreeHexagon() {
    return this.pixelService.getRandomFreeHexagon();
  }
}
