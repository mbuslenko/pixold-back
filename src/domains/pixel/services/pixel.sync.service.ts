import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection } from 'typeorm';

import { PixelEntity } from '../../../models/pixel.entity';

@Injectable()
export class PixelSyncService implements OnModuleInit {
  constructor(private connection: Connection) {}

  async onModuleInit() {
    const data = require('../data/pixels.map.json');

    await this.connection.manager.transaction(async (transactionManager) => {
      await Promise.all(
        data.map(async (el) => {
          const row = await transactionManager.findOne(PixelEntity, {
            where: { numericId: el.id },
          });

          if (!row) {
            await transactionManager.save(
              transactionManager.create(PixelEntity, {
                numericId: el.id,
                xCoordinate: el.x,
                yCoordinate: el.y,
              }),
            );
          }
        }),
      );
    });
  }
}
