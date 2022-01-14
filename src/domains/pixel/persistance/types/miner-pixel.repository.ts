import { EntityRepository, Repository } from 'typeorm';
import { MinerPixelEntity } from '../../../../models/miner-pixel.entity';

@EntityRepository(MinerPixelEntity)
export class MinerPixelRepository extends Repository<MinerPixelEntity> {
  async substractCoinsFromStorages(userId: string, percent: number): Promise<void> {
    return this.query(`
    UPDATE miner_pixel
    SET coins_in_storage = (
      SELECT 
        coins_in_storage - (coins_in_storage * ${percent} / 100) 
      FROM miner_pixel 
      WHERE numeric_id = miner_pixel.numeric_id
      )
    JOIN pixel
    ON pixel.numeric_id = miner_pixel.numeric_id
    WHERE pixel.owner_id = '${userId}'
    `)
  }
}
