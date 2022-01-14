import { Column, Entity } from 'typeorm';
import { PixelLevelsEnum } from '../common/consts/level.enum';

import { PixoldBaseEntity } from '../common/db/base-entity';

@Entity({ name: 'defender_pixel' })
export class DefenderPixelEntity extends PixoldBaseEntity<DefenderPixelEntity> {
  @Column({
    type: 'enum',
    enum: ['starter', 'middle', 'pro', 'supreme'],
    default: 'starter',
  })
  level: PixelLevelsEnum;

  @Column({ name: 'is_attacked', type: 'boolean', default: false })
  isAttacked: boolean;

  @Column({ name: 'numeric_id', type: 'real' })
  numericId: number;
}
