import { EntityRepository, Repository } from 'typeorm';
import { MinerPixelEntity } from '../../../../models/miner-pixel.entity';

@EntityRepository(MinerPixelEntity)
export class MinerPixelRepository extends Repository<MinerPixelEntity> {
	async substractCoinsFromStorages(
		userId: string,
		percent: number,
	): Promise<void> {
		const substractedCoinsNumber = await this.getSubstractedCoinsNumber(
			userId,
			percent,
		);

		let miningHexagonsNumber = 0;

		const allCoins = await this.query(
			`
      SELECT 
      coins_in_storage
    FROM miner_pixel
    JOIN pixel
    ON pixel.numeric_id = miner_pixel.numeric_id
    WHERE pixel.owner_id = '${userId}'
    `,
		).then((res) => {
			let result = 0;
			res.map((item) => {
				result += item.coins_in_storage;

				miningHexagonsNumber++;
			});
			return result;
		});

		const newCoinsNumber =
			(allCoins - substractedCoinsNumber) / miningHexagonsNumber;

    const allMiners = await this.query(`
    SELECT miner_pixel.numeric_id
    FROM miner_pixel
    LEFT JOIN pixel
    ON pixel.numeric_id = miner_pixel.numeric_id
    WHERE pixel.owner_id = '${userId}'
    `).then(res => res.map(item => item.numeric_id));

		return this.query(`
    UPDATE miner_pixel
    SET coins_in_storage = ${newCoinsNumber}
    where numeric_id IN (
    ${allMiners}
    )
    `);
	}

	async getSubstractedCoinsNumber(
		userId: string,
		percent: number,
	): Promise<number> {
		return this.query(
			`
    SELECT 
      (coins_in_storage * ${percent} / 100) as number
    FROM miner_pixel
    JOIN pixel
    ON pixel.numeric_id = miner_pixel.numeric_id
    WHERE pixel.owner_id = '${userId}'
    `,
		).then((res) => {
			let result = 0;
			res.map((item) => {
				result += item.number;
			});
			return result;
		});
	}
}
