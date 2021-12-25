import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PixelDomain } from '../../domains/pixel/pixel.domain';
import { GetAllPixelsOkResponse } from './dto/pixel.dto';

@ApiTags('pixel')
@Controller('pixel')
export class PixelController {
  constructor(private readonly pixelDomain: PixelDomain) {}

  @ApiOperation({ summary: 'Get whole pixels map' })
  @ApiOkResponse({ type: GetAllPixelsOkResponse })
  @Get('/all')
  async getAllPixels() {
    return this.pixelDomain.getAllPixels();
  }
}
