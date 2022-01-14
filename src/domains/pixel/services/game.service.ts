import { Injectable } from '@nestjs/common';
import { AttackHexagonDto } from '../../../api/pixel/dto/pixel.dto';

import { PixelLevelsEnum } from '../../../common/consts/level.enum';
import { sendNotification } from '../../../common/utils/telegram-notifications';
import { CoinDomain } from '../../coin/coin.domain';

import { PixelRepository } from '../persistance/pixel.repository';
import { AttackPixelRepository } from '../persistance/types/attack-pixel.repository';
import { MinerPixelRepository } from '../persistance/types/miner-pixel.repository';

@Injectable()
export class GameService {
  constructor(
    private readonly pixelRepository: PixelRepository,
    private readonly minerPixelRepository: MinerPixelRepository,
    private readonly attackPixelRepository: AttackPixelRepository,

    private readonly coinDomain: CoinDomain,
  ) {}

  async miningCron(): Promise<void> {
    const miners = await this.minerPixelRepository.find({
      select: ['numericId'],
    });

    await Promise.all(
      // TODO: change to transaction
      miners.map(async (el) => {
        await this.mine(el.numericId);
      }),
    );
  }

  async attackHexagon(userId: string, props: AttackHexagonDto) {
    const attackerRow = await this.attackPixelRepository.findOne({
      where: { numericId: props.from },
    })

    const attackedPixel = await this.pixelRepository.findOne({
      where: { numericId: props.to },
    })

    let attackedRow;

    switch (attackedPixel.type) {
      case 'miner':
        attackedRow = await this.minerPixelRepository.findOne({
          where: { numericId: props.to },
        })
        break;
      case 'attack':
      
    }
  }

  async mine(numericId: number) {
    const row = await this.minerPixelRepository.findOne({
      where: { numericId },
    });

    let percent = 0;

    switch (row.level) {
      case PixelLevelsEnum.STARTER:
        percent = 15;
        break;
      case PixelLevelsEnum.MIDDLE:
        percent = 30;
        break;
      case PixelLevelsEnum.MIDDLE:
        percent = 40;
        break;
      case PixelLevelsEnum.PRO:
        percent = 50;
        break;
      case PixelLevelsEnum.SUPREME:
        percent = 65;
    }

    let minedCoins = 0;
    if (this.willMine(percent)) {
      minedCoins = (Math.floor(Math.random() * 10) + 1) / 2;

      const check = await this.checkIfThereAreEnoughCoins(minedCoins);

      if (check) {
        // TODO: make balance change for pixold account

        await this.minerPixelRepository.update(
          { numericId },
          { coinsInStorage: row.coinsInStorage + minedCoins },
        );
      }
    }
  }

  willMine(percent: number): boolean {
    return Math.random() * 100 < percent;
  }

  async checkIfThereAreEnoughCoins(coins: number): Promise<boolean> {
    const coinsLeft = await this.coinDomain.getPixoldCoinsLeft();

    if (coinsLeft < 100) {
      sendNotification(
        `[ERROR] @mbuslenko @myroslavvv You have ${coinsLeft} coins left. Mining stopped for all accounts.`,
      );

      return;
    } else if (coinsLeft < 10_000) {
      sendNotification(`[WARNING] You have ${coinsLeft} coins left.`);
      return;
    }

    return coinsLeft > coins;
  }
}
