import { Injectable } from '@nestjs/common';

import { PixelRepository } from '../persistance/pixel.repository';

@Injectable()
export class PixelService {
  constructor(
    private readonly pixelRepository: PixelRepository,
  ) {}

  async getPixelInfoById(id: number) {
    return this.pixelRepository.findOne({
      where: { numericId: id },
    });
  }
}
