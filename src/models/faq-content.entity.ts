import { Column, Entity } from 'typeorm';

import { PixoldBaseEntity } from '../common/db/base-entity';

@Entity({ name: 'faq_content' })
export class FaqContentEntity extends PixoldBaseEntity<FaqContentEntity> {
  @Column()
  question: string;

  @Column()
  answer: string;

  @Column({ name: 'topic_id' })
  topicId: string;
}
