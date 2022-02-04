import { Column, Entity } from 'typeorm';
import { PixoldBaseEntity } from '../common/db/base-entity';

@Entity({ name: 'attacks' })
export class AttacksEntity extends PixoldBaseEntity<AttacksEntity> {
	@Column({ name: 'attacked_id', type: 'real' })
	attackedId: number;

	@Column({ name: 'attacker_id', type: 'real' })
	attackerId: number;

	@Column()
	finished: boolean;

	// TODO: Delete default
	@Column({ name: 'attacked_user_id', default: 'deprecated_row' })
	attackedUserId: string;
}
