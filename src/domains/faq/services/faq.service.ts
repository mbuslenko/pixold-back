import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateFaqDto } from '../../../api/faq/dto/faq.dto';
import { FaqContentEntity } from '../../../models';

import { FaqTopicsEntity } from '../../../models/faq-topics.entity';
import { FaqContentRepository } from '../persistance/faq-content.repository';
import { FaqTopicsRepository } from '../persistance/faq-topics.repository';

@Injectable()
export class FaqService {
  constructor(
    private readonly faqContentRepository: FaqContentRepository,
    private readonly faqTopicsRepository: FaqTopicsRepository,
  ) {}

  async getAllContent(): Promise<FaqService.AllContentResponse[]> {
    const topics = (await this.faqTopicsRepository.find({
      select: ['id', 'name'],
    })) as unknown as FaqService.AllContentResponse[];

    topics.forEach((el) => {
      el.content = [];
    });

    await Promise.all(
      topics.map(async (topic) => {
        topic.content = await this.faqContentRepository.find({
          select: ['id', 'answer', 'question'],
          where: { topicId: topic.id },
        });
      }),
    );

    return topics;
  }

  async createContent(props: CreateFaqDto) {
    return this.faqContentRepository.save(
      this.faqContentRepository.create(props)
    )
  }
}

export namespace FaqService {
  export interface AllContentResponse {
    id: string;
    name: string;
    content: FaqContentEntity[];
  }
}
