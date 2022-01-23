import { Injectable } from '@nestjs/common';
import { AttackHexagonDto } from '../../api/pixel/dto/pixel.dto';
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

  async attackHexagon(userId: string, props: AttackHexagonDto) {
    return this.gameService.attackHexagon(userId, props);
  }

  async upgradeHexagon(userId: string, numericId: number) {
    return this.pixelService.upgradeHexagon(userId, numericId);
  }

  async buyHexagon(userId: string, numericId: number) {
    return this.pixelService.buyHexagon(userId, numericId);
  }

  async sendCoinsFromMinerToWallet(numericId: number, userId: string) {
    return this.pixelService.sendCoinsFromMinerToWallet(numericId, userId);
  }
}
