import { EntityRepository, Repository } from 'typeorm';
import { MinerPixelEntity } from '../../../../models/miner-pixel.entity';

@EntityRepository(MinerPixelEntity)
export class MinerPixelRepository extends Repository<MinerPixelEntity> {
  
}
