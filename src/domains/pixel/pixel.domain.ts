import { Injectable } from '@nestjs/common';

import { PixelService } from './services/pixel.service';

@Injectable()
export class PixelDomain {
  constructor(private readonly pixelService: PixelService) {}

  async getAllPixels() {
    return this.pixelService.getAllPixels();
  }

  async redeemCode(userId: string, code: string) {
    return this.pixelService.redeemCode(userId, code);
  }
}
