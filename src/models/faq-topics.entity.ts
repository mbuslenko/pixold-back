import { Column, Entity, OneToMany } from 'typeorm';

import { PixoldBaseEntity } from '../common/db/base-entity';
import { FaqContentEntity } from './faq-content.entity';

@Entity({ name: 'faq_topics' })
export class FaqTopicsEntity extends PixoldBaseEntity<FaqTopicsEntity> {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => FaqContentEntity, (content) => content.topicId)
  content: FaqContentEntity[];
}
