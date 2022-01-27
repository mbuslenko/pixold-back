import { EntityRepository, Repository } from 'typeorm';

import { FaqTopicsEntity } from '../../../models/faq-topics.entity';

@EntityRepository(FaqTopicsEntity)
export class FaqTopicsRepository extends Repository<FaqTopicsEntity> {
  async getAllContent() {
    return this.query(`
    SELECT * 
    FROM faq_topics "ft"
    LEFT JOIN faq_content "fq"
      ON "fq"."topic_id"::uuid = "ft"."id"
    `);
  }
}
