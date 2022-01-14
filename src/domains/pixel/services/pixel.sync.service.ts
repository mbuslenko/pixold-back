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

            const redemptionCode = generateRandomString();

            await transactionManager
              .createQueryBuilder()
              .insert()
              .into(PixelEntity)
              .values([
                {
                  numericId,
                  xCoordinate: el.x,
                  yCoordinate: el.y,
                  redemptionCode,
                },
              ])
              .orIgnore()
              .execute();
          }),
        );
      });
    }
  }
}
