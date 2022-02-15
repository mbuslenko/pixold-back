import { EntityRepository, Repository } from 'typeorm';
import { AttackPixelEntity } from '../../../../models';

@EntityRepository(AttackPixelEntity)
export class AttackPixelRepository extends Repository<AttackPixelEntity> {
	async getSubstractedHealthNumber(userId: string, percent: number) {
		return this.query(`
        SELECT 
            (health * ${percent} / 100)
        FROM attack_pixel
        JOIN pixel
        ON pixel.numeric_id = attack_pixel.numeric_id
        WHERE pixel.owner_id = '${userId}'
    `);
	}

	async substractHealth(userId: string, percent: number): Promise<void> {
		const allAttackers = await this.query(
			`
        SELECT attack_pixel.numeric_id
        FROM attack_pixel
        LEFT JOIN pixel
        ON pixel.numeric_id = attack_pixel.numeric_id
        WHERE pixel.owner_id = '${userId}'
        `,
		).then((res) => res.map((item) => item.numeric_id));

		if (allAttackers.length === 0) {
			return;
		}

		return this.query(`
        update attack_pixel 
        set health = 
	        case 
	        when (health - (health * ${percent} / 100)) < 1 then 0
	        else health - (health * ${percent} / 100)
	        end
        where id in (${allAttackers})
    `);
	}
}
