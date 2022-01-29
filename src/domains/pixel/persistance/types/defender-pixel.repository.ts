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

	async substractHealth(
		userId: string,
		percent: number,
	): Promise<void> {
		return this.query(`
        UPDATE defender_pixel
        SET health = (
        SELECT 
            health - (health * ${percent} / 100) 
        FROM defender_pixel 
        WHERE numeric_id = defender_pixel.numeric_id
        )
        JOIN pixel
        ON pixel.numeric_id = defender_pixel.numeric_id
        WHERE pixel.owner_id = '${userId}'
    `);
	}
}
