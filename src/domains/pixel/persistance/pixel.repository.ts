import { throws } from 'assert';
import { EntityRepository, Repository } from 'typeorm';

import { PixelEntity } from '../../../models/pixel.entity';

@EntityRepository(PixelEntity)
export class PixelRepository extends Repository<PixelEntity> {
  async getOwnersList() {
    return this.createQueryBuilder('pixel')
      .select(['owner_id'])
      .groupBy('owner_id')
      .getRawMany()
      .then((res) => res.map((el) => el.owner_id));
  }

  async getOneRandomFreeHexagon() {
    return this.query(`
      SELECT numeric_id
      FROM pixel
      WHERE owner_id = 'pixold'
      ORDER BY RANDOM()
      LIMIT 1
    `);
  }
}
