import { EntityRepository, Repository } from 'typeorm';
import { DefenderPixelEntity } from '../../../../models/defender-pixel.entity';

@EntityRepository(DefenderPixelEntity)
export class DefenderPixelRepository extends Repository<DefenderPixelEntity> {
	async getSubstractedHealthNumber(userId: string, percent: number) {
		return this.query(`
        SELECT 
          (health * ${percent} / 100)
        FROM defender_pixel
        JOIN pixel
        ON pixel.numeric_id = defender_pixel.numeric_id
        WHERE pixel.owner_id = '${userId}'
        `);
	}

	async substractHealth(userId: string, percent: number): Promise<void> {
		const allDefenders = await this.query(
			`
        SELECT defender_pixel.numeric_id
        FROM defender_pixel
        LEFT JOIN pixel
        ON pixel.numeric_id = defender_pixel.numeric_id
        WHERE pixel.owner_id = '${userId}'
        `,
		).then((res) => res.map((item) => item.numeric_id));

        if (allDefenders.length === 0) {
            return
        }

		return this.query(`
        update defender_pixel 
        set health = 
	        case 
	        when (health - (health * ${percent} / 100)) < 1 then 0
	        else health - (health * ${percent} / 100)
	        end
        where id in (${allDefenders})
    `);
	}
}
