import { Column, Entity } from 'typeorm';
import { PixoldBaseEntity } from '../common/db/base-entity';

@Entity({ name: 'attacks' })
export class AttacksEntity extends PixoldBaseEntity<AttacksEntity> {
	@Column({ name: 'attacked_x', type: 'real' })
	attackedX: number;

	@Column({ name: 'attacked_y', type: 'real' })
	attackedY: number;

	@Column({ name: 'attacker_x', type: 'real' })
	attackerX: number;

	@Column({ name: 'attacker_y', type: 'real' })
	attackerY: number;

	@Column()
	finished: boolean;
}
