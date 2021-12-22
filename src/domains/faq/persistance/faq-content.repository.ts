import { EntityRepository, Repository } from 'typeorm';

import { FaqContentEntity } from '../../../models/faq-content.entity';

@EntityRepository(FaqContentEntity)
export class FaqContentRepository extends Repository<FaqContentEntity> {

}
