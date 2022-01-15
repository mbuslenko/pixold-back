import { performance } from 'perf_hooks';
import { Injectable } from '@nestjs/common';

import { AttackHexagonDto } from '../../../api/pixel/dto/pixel.dto';
import { PixelLevelsEnum } from '../../../common/consts/level.enum';
import { sendNotification } from '../../../common/utils/telegram-notifications';

import { CoinDomain } from '../../coin/coin.domain';

import { PixelRepository } from '../persistance/pixel.repository';
import { AttackPixelRepository } from '../persistance/types/attack-pixel.repository';
import { MinerPixelRepository } from '../persistance/types/miner-pixel.repository';
import { DefenderPixelRepository } from '../persistance/types/defender-pixel.repository';
import { EventsGateway } from '../../../events/events.gateway';
import { PixelTypes } from '../../../common/consts/pixel-types.type';

@Injectable()
export class GameService {
  constructor(
    private readonly pixelRepository: PixelRepository,
    private readonly minerPixelRepository: MinerPixelRepository,
    private readonly attackPixelRepository: AttackPixelRepository,
    private readonly defenderPixelRepository: DefenderPixelRepository,

    private readonly coinDomain: CoinDomain,

    private readonly eventsGateway: EventsGateway,
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

  async attackHexagon(userId: string, props: AttackHexagonDto): Promise<void> {
    // TODO: change to transaction

    const start = performance.now();

    const attackerRow = await this.attackPixelRepository.findOne({
      where: { numericId: props.from },
    });

    const attackerPixel = await this.pixelRepository.findOne({
      where: { numericId: props.from },
    });

    const attackedPixel = await this.pixelRepository.findOne({
      where: { numericId: props.to },
    });

    const attackedHexagons: GameService.PixelInfo[] = await this.pixelRepository.find({
      select: ['numericId', 'type', 'xCoordinate', 'yCoordinate'],
      where: { ownerId: attackedPixel.ownerId },
    });

    const closestHexagonId = this.findClosestHexagon(
      {
        xCoordinate: attackerPixel.xCoordinate,
        yCoordinate: attackerPixel.yCoordinate,
      },
      attackedHexagons,
    );

    const closestHexagonRow = await this.pixelRepository.findOne({
      where: { numericId: closestHexagonId },
    });

    const distance = this.calculateDistance(attackerPixel, closestHexagonRow);

    const { sum: coinsInStorage } = await this.getAllCoinsInUsersStorages(
      attackerPixel.ownerId,
    );
    const hexagonsNumber = attackedHexagons.length;

    let percentRobbed = 0;
    let timeForAttackInSeconds = distance * 2;

    if (closestHexagonRow.type === 'defender') {
      // TODO: add logic for defender
    } else {
      switch (attackerRow.level) {
        case PixelLevelsEnum.STARTER:
          // random percent between 15 and 30
          percentRobbed = Math.floor(Math.random() * 15) + 15;
          timeForAttackInSeconds += hexagonsNumber * 60;
          break;
        case PixelLevelsEnum.MIDDLE:
          percentRobbed = Math.floor(Math.random() * 15) + 30;
          timeForAttackInSeconds += hexagonsNumber * 55;
          break;
        case PixelLevelsEnum.PRO:
          percentRobbed = Math.floor(Math.random() * 15) + 45;
          timeForAttackInSeconds += hexagonsNumber * 50;
          break;
        case PixelLevelsEnum.SUPREME:
          percentRobbed = Math.floor(Math.random() * 20) + 60;
          timeForAttackInSeconds += hexagonsNumber * 45;
          break;
      }
    }

    // todo: what if there are no coins in storage?
    await this.minerPixelRepository.substractCoinsFromStorages(
      attackedPixel.ownerId,
      percentRobbed,
    );

    // TODO: send coins to the robber

    const end = performance.now();

    const finalTimeForAttack = timeForAttackInSeconds - (end - start);

    if (finalTimeForAttack < 0) {
      return this.eventsGateway.sendAttackMessage({
        to: userId,
        type: 'success',
        message: `Your previous attack was successfully completed`,
      });
    }

    setTimeout(() => {
      this.eventsGateway.sendAttackMessage({
        to: userId,
        type: 'success',
        message: `Your previous attack was successfully completed`,
      });
    }, finalTimeForAttack * 1000);
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

  findClosestHexagon(
    from: GameService.PixelCoordinates,
    arr: GameService.PixelInfo[],
  ): number {
    let minDistance = Infinity;
    let closestHexagon = -1;

    arr.forEach((el) => {
      const distance = this.calculateDistance(from, el);

      if (distance < minDistance) {
        minDistance = distance;
        closestHexagon = el.numericId;
      }
    });

    return closestHexagon;
  }

  calculateDistance(
    from: GameService.PixelCoordinates,
    to: GameService.PixelCoordinates,
  ) {
    const x = from.xCoordinate - to.xCoordinate;
    const y = from.yCoordinate - to.yCoordinate;

    return Math.sqrt(x * x + y * y);
  }

  async getAllCoinsInUsersStorages(userId: string): Promise<{ sum: number }> {
    return this.minerPixelRepository.query(
      `SELECT SUM(coinsInStorage) FROM miner_pixels WHERE ownerId = '${userId}'`,
    );
  }
}

export namespace GameService {
  export interface PixelInfo extends PixelCoordinates {
    numericId: number;
    type: PixelTypes;
  }

  export interface PixelCoordinates {
    xCoordinate: number;
    yCoordinate: number;
  }
}
