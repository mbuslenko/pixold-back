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
      SELECT numeric_id, opensea_url
      FROM pixel
      WHERE owner_id = 'pixold'
      AND opensea_url IS NOT NULL
      ORDER BY RANDOM()
      LIMIT 1
    `);
  }

  async getHealthOrCoinsInStorage(numericId: number) {
    let result = 100;

    const attack = await this.query(`
      SELECT health
      FROM attack_pixel
      WHERE numeric_id = ${numericId}
    `);

    const defender = await this.query(`
      SELECT health
      FROM defender_pixel
      WHERE numeric_id = ${numericId}
    `);

    if (attack.length) {
      result += attack[0].health;
    } else if (defender.length) {
      result += defender[0].health;
    }

    return result;
  }

  async clearTypeForHexagon(numericId: number) {
    await this.query(`
    DELETE FROM
      miner_pixel
    WHERE numeric_id = ${numericId}
    `);

    await this.query(`
    DELETE FROM
      attack_pixel
    WHERE numeric_id = ${numericId}
    `);

    await this.query(`
    DELETE FROM
      defender_pixel
    WHERE numeric_id = ${numericId}
    `);

    await this.query(`
      UPDATE pixel
      SET type = 'without'
      WHERE numeric_id = ${numericId}
    `);
  }
}
