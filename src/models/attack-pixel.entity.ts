import { Column, Entity } from 'typeorm';

import { PixelLevelsEnum } from '../common/consts/level.enum';
import { PixoldBaseEntity } from '../common/db/base-entity';

@Entity({ name: 'attack_pixel' })
export class AttackPixelEntity extends PixoldBaseEntity<AttackPixelEntity> {
  @Column({
    type: 'enum',
    enum: ['starter', 'middle', 'pro', 'supreme'],
    default: 'starter',
  })
  level: PixelLevelsEnum;

  @Column({ name: 'is__attacking', type: 'boolean', default: false })
  isAttacking: boolean;

  @Column({ name: 'is_attacked', type: 'boolean', default: false })
  isAttacked: boolean;

  @Column({ name: 'numeric_id', type: 'real' })
  numericId: number;

  @Column({ type: 'real', default: 100 })
  health: number;
}
