import { Column, Entity } from 'typeorm';
import { PixoldBaseEntity } from '../common/db/base-entity';

@Entity({ name: 'pixel' })
export class PixelEntity extends PixoldBaseEntity<PixelEntity> {
  @Column({ name: 'numeric_id', type: 'real', unique: true })
  numericId: number;

  @Column({ type: 'varchar', default: 'without' })
  type: 'attack' | 'miner' | 'defender' | 'without';

  @Column({ name: 'owner_id', default: 'pixold' })
  ownerId: string;

  @Column({ name: 'x_coordinate', type: 'real' })
  xCoordinate: number;

  @Column({ name: 'y_coordinate', type: 'real' })
  yCoordinate: number;

  @Column({ name: 'redemption_code', default: '' })
  redemptionCode: string;
}
