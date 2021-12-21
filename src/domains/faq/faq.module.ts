import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqDomain } from './faq.domain';

import { FaqContentRepository } from './persistance/faq-content.repository';
import { FaqTopicsRepository } from './persistance/faq-topics.repository';
import { FaqService } from './services/faq.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FaqTopicsRepository, FaqContentRepository]),
  ],
  providers: [FaqDomain, FaqService],
  exports: [FaqDomain],
})
export class FaqModule {}
