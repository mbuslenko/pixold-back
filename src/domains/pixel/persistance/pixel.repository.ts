import { EntityRepository, Repository } from 'typeorm';

import { PixelEntity } from '../../../models/pixel.entity';

@EntityRepository(PixelEntity)
export class PixelRepository extends Repository<PixelEntity> {
  
}