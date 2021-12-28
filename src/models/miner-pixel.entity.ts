import { Column, Entity } from 'typeorm';

import { PixelLevelsEnum } from '../common/consts/level.enum';
import { PixoldBaseEntity } from '../common/db/base-entity';

@Entity({ name: 'miner_pixel' })
export class MinerPixelEntity extends PixoldBaseEntity<MinerPixelEntity> {
  @Column({
    type: 'enum',
    enum: ['starter', 'middle', 'pro', 'supreme'],
    default: 'starter',
  })
  level: PixelLevelsEnum;

  @Column({ name: 'coins_in_storage', type: 'real' })
  coinsInStorage: number;

  @Column({ name: 'is_attacked', type: 'boolean', default: false })
  isAttacked: boolean;

  @Column({ name: 'numeric_id', type: 'real' })
  numericId: number;
}
