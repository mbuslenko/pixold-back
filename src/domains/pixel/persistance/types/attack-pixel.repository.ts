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

    async substractHealth(
		userId: string,
		percent: number,
	): Promise<void> {
		return this.query(`
        UPDATE attack_pixel
        SET health = (
        SELECT 
            health - (health * ${percent} / 100) 
        FROM attack_pixel 
        WHERE numeric_id = attack_pixel.numeric_id
        )
        JOIN pixel
        ON pixel.numeric_id = attack_pixel.numeric_id
        WHERE pixel.owner_id = '${userId}'
    `);
	}
}
