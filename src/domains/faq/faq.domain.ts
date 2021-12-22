import { Injectable } from '@nestjs/common';

import { CreateFaqDto } from '../../api/faq/dto/faq.dto';

import { FaqService } from './services/faq.service';

@Injectable()
export class FaqDomain {
  constructor(
    private readonly faqService: FaqService,
  ) {}

  async getAllContent() {
    return this.faqService.getAllContent();
  }

  async createContent(props: CreateFaqDto) {
    return this.faqService.createContent(props);
  }
}
