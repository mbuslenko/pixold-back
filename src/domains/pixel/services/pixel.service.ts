import { Injectable } from '@nestjs/common';
import { generateRandomColor } from '../../../common/utils/generate-color';

import { PixelRepository } from '../persistance/pixel.repository';

@Injectable()
export class PixelService {
  constructor(private readonly pixelRepository: PixelRepository) {}

  async getAllPixels() {
    const owners = await this.pixelRepository.getOwnersList();

    const rows = [];

    await Promise.all(
      owners.map(async (ownerId) => {
        const color = ownerId === 'pixold' ? '#2D3436' : generateRandomColor();

        const ownersPixels = await this.pixelRepository.find({
          select: ['numericId'],
          where: { ownerId },
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

  async getPixelInfoById(id: number) {
    return this.pixelRepository.findOne({
      where: { numericId: id },
    });
  }
}
