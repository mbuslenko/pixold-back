import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';

import { FaqDomain } from '../../domains/faq/faq.domain';
import { CreateFaqDto } from './dto/faq.dto';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqDomain: FaqDomain) {}

  @Get()
  async getAllContent() {
    return this.faqDomain.getAllContent();
  }

  @UsePipes(new ValidationPipe())
  @Post('/create')
  async createContent(@Body() props: CreateFaqDto) {
    return this.faqDomain.createContent(props);
  }
}
