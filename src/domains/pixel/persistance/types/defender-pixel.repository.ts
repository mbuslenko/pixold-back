import { EntityRepository, Repository } from 'typeorm';
import { DefenderPixelEntity } from '../../../../models/defender-pixel.entity';

@EntityRepository(DefenderPixelEntity)
export class DefenderPixelRepository extends Repository<DefenderPixelEntity> {

}
