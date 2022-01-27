import { EntityRepository, Repository } from 'typeorm';
import { AttackPixelEntity } from '../../../../models';

@EntityRepository(AttackPixelEntity)
export class AttackPixelRepository extends Repository<AttackPixelEntity> {}
