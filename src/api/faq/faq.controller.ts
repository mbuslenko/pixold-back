import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { FaqDomain } from '../../domains/faq/faq.domain';
import { CreateFaqDto, FaqOkResponse } from './dto/faq.dto';

@ApiTags('faq')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqDomain: FaqDomain) {}

  @Get()
  @ApiOperation({ summary: 'Get all faq content' })
  @ApiOkResponse({ type: FaqOkResponse })
  async getAllContent() {
    return this.faqDomain.getAllContent();
  }

  @UsePipes(new ValidationPipe())
  @Post('/create')
  async createContent(@Body() props: CreateFaqDto) {
    return this.faqDomain.createContent(props);
  }
}
