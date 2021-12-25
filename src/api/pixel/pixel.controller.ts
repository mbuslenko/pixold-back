import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PixoldAuthGuard } from '../../common/guards/auth.guard';

import { PixelDomain } from '../../domains/pixel/pixel.domain';
import { GetAllPixelsOkResponse } from './dto/pixel.dto';

@ApiTags('pixel')
@Controller('pixel')
export class PixelController {
  constructor(private readonly pixelDomain: PixelDomain) {}

  @UseGuards(PixoldAuthGuard)
  @ApiOperation({ summary: 'Get whole pixels map' })
  @ApiOkResponse({ type: GetAllPixelsOkResponse })
  @Get('/all')
  async getAllPixels() {
    return this.pixelDomain.getAllPixels();
  }
}
