import { Injectable } from '@nestjs/common';
import { PixelService } from './services/pixel.service';

@Injectable()
export class PixelDomain {
  constructor(
    private readonly pixelService: PixelService,
  ) {}
}
