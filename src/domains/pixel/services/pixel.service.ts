import { BadRequestException, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { PixelLevelsEnum } from '../../../common/consts/level.enum';
import { generateRandomColor } from '../../../common/utils/generate-color';
import { CoinDomain } from '../../coin/coin.domain';
import { UserDomain } from '../../user/user.domain';

import { PixelRepository } from '../persistance/pixel.repository';
import { MinerPixelRepository } from '../persistance/types/miner-pixel.repository';

@Injectable()
export class PixelService {
  constructor(
    private readonly connection: Connection,

    private readonly pixelRepository: PixelRepository,
    private readonly coinDomain: CoinDomain,

    private readonly minerPixelRepository: MinerPixelRepository,
    private readonly userDomain: UserDomain,
  ) {}

  async getAllPixelsOwnedByUsers(): Promise<PixelService.GetAllPixelsResponse> {
    const owners = await this.pixelRepository.getOwnersList();

    const result = {};

    await Promise.all(
      owners.map(async (ownerId) => {
        await this.connection.manager.transaction(
          async (transactionManager) => {
            if (ownerId != 'pixold') {
              const ownersPixels = await transactionManager.query(
                `SELECT numeric_id FROM pixel WHERE owner_id = '${ownerId}'`,
              );

              const username = (await this.userDomain.getUserById(ownerId))
                .username;

              const numericIds = ownersPixels.map((el) => el.numeric_id);

              result[username] = numericIds;
            }
          },
        );
      }),
    );

    return result;
  }

  async getAllPixels() {
    const owners = await this.pixelRepository.getOwnersList();

    const rows = [];

    await Promise.all(
      owners.map(async (el) => {
        const color =
          el.owner_id === 'pixold' ? '#2D3436' : generateRandomColor();

        const ownersPixels = await this.pixelRepository.find({
          select: ['numericId'],
          where: { ownerId: el.owner_id },
        });

        ownersPixels.forEach((el) => {
          rows.push({
            color,
            ...el,
          });
        });
      }),
    );

    return rows;
  }

  async redeemCode(userId: string, redemptionCode: string) {
    const pixel = await this.pixelRepository.findOne({
      where: { redemptionCode },
    });

    if (!pixel) {
      throw new BadRequestException({ message: 'Invalid code' });
    } else if (pixel.ownerId == userId) {
      throw new BadRequestException({
        message: 'You already own this hexagon',
      });
    }

    pixel.ownerId = userId;

    await this.pixelRepository.save(pixel);
  }

  async getAmountOfCoinsToUpgrade(
    type: 'attack' | 'miner' | 'defender' | 'without',
    actualLevel: PixelLevelsEnum,
  ) {
    let priceInUsd = 0;

    switch (actualLevel) {
      case PixelLevelsEnum.STARTER:
        switch (type) {
          case 'attack':
            priceInUsd = 30;
            break;
          case 'miner':
            priceInUsd = 50;
            break;
          case 'defender':
            priceInUsd = 100;
        }
        break;
      case PixelLevelsEnum.MIDDLE:
        switch (type) {
          case 'attack':
            priceInUsd = 50;
            break;
          case 'miner':
            priceInUsd = 100;
            break;
          case 'defender':
            priceInUsd = 200;
        }
        break;
      case PixelLevelsEnum.PRO:
        switch (type) {
          case 'attack':
            priceInUsd = 100;
            break;
          case 'miner':
            priceInUsd = 200;
            break;
          case 'defender':
            priceInUsd = 400;
        }
    }

    return this.coinDomain.getAmountInCoins(priceInUsd);
  }

  async changeType(
    numericId: number,
    type: 'attack' | 'miner' | 'defender',
    userId: string,
  ): Promise<void> {
    const row = await this.pixelRepository.findOne({ where: { numericId } });

    if (row.ownerId === userId) {
      await this.pixelRepository.update({ numericId }, { type });
    } else {
      throw new BadRequestException({
        message: 'You can not change type of other user hexagon',
      });
    }
  }

  async getHexagonInfo(
    numericId: number,
    userId: string,
  ): Promise<PixelService.HexagonInfo> {
    const hexagonRow = await this.pixelRepository.findOne({
      where: { numericId },
    });

    if (!hexagonRow) {
      throw new BadRequestException({ message: 'Hexagon not found' });
    }

    if (hexagonRow.ownerId === 'pixold') {
      return {
        type: 'without',
        level: PixelLevelsEnum.STARTER,
        coinsInStorage: 0,
        owner: 'pixold',
        canAttack: false,
        coinsToUpgrade: 0,
      };
    }

    const ownerUsername = (
      await this.userDomain.getUserById(hexagonRow.ownerId)
    ).username;

    let typeRow: any;

    switch (hexagonRow.type) {
      case 'miner':
        typeRow = await this.minerPixelRepository.findOne({
          where: { numericId },
        }); // TODO: make for other types
        break;
      case 'attack':
        break;
      case 'defender':
        break;
      case 'without':
        typeRow = { level: PixelLevelsEnum.STARTER };
    }

    return {
      type: hexagonRow.type,
      level: typeRow.level,
      coinsInStorage: typeRow.coinsInStorage,
      owner: ownerUsername,
      canAttack: hexagonRow.ownerId !== userId,
      coinsToUpgrade: await this.getAmountOfCoinsToUpgrade(
        hexagonRow.type,
        typeRow.level,
      ),
    };
  }
}

export namespace PixelService {
  export interface HexagonInfo {
    type: 'attack' | 'miner' | 'defender' | 'without';
    level: PixelLevelsEnum;
    coinsInStorage: number;
    owner: string;
    canAttack: boolean;
    coinsToUpgrade: number;
  }

  export interface GetAllPixelsResponse {
    [key: string]: {
      numericId: number;
    }[];
  }
}
