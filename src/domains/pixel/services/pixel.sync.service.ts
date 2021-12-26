import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection } from 'typeorm';

import * as data from '../data/pixels-map.json';
import { NODE_ENV } from '../../../config';
import { PixelEntity } from '../../../models/pixel.entity';
import { generateRandomString } from '../../../common/utils/generate-string';

@Injectable()
export class PixelSyncService implements OnModuleInit {
  constructor(private connection: Connection) {}

  async onModuleInit() {
    if (NODE_ENV == 'production') {
      await this.connection.manager.transaction(async (transactionManager) => {
        await Promise.all(
          data.map(async (el) => {
            const numericId = data.indexOf(el) + 1;

            const row = await transactionManager.findOne(PixelEntity, {
              where: { numericId },
            });

            if (!row) {
              const redemptionCode = generateRandomString()

              await transactionManager.save(
                transactionManager.create(PixelEntity, {
                  numericId,
                  xCoordinate: el.x,
                  yCoordinate: el.y,
                  redemptionCode,
                }),
              );
            }
          }),
        );
      });
    }
  }
}
