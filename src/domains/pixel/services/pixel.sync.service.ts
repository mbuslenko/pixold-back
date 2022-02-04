import { Injectable, OnModuleInit } from '@nestjs/common';

import * as data from '../data/pixels-map.json';
import * as links from '../data/opensea-links.json';
import { NODE_ENV } from '../../../config';
import { PixelEntity } from '../../../models/pixel.entity';
import { generateRandomString } from '../../../common/utils/generate-string';
import { PixelRepository } from '../persistance/pixel.repository';
import { Connection } from 'typeorm';

@Injectable()
export class PixelSyncService implements OnModuleInit {
	constructor(
		private readonly connection: Connection,
		private pixelRepository: PixelRepository,
	) {}

	async onModuleInit() {
		if (NODE_ENV == 'sync') {
			const preparedData = [];

			data.forEach((el) => {
				const redemptionCode = generateRandomString();

				preparedData.push({
					xCoordinate: el.x,
					yCoordinate: el.y,
					numericId: data.indexOf(el) + 1,
					redemptionCode,
				});
			});

			await this.pixelRepository
				.createQueryBuilder()
				.insert()
				.into(PixelEntity)
				.values(preparedData)
				.orIgnore()
				.execute();
		}

		if (NODE_ENV == 'export') {
			const dataFromDB = await this.pixelRepository.find();

			//write data to json file
			const json = JSON.stringify(dataFromDB, null, 2);
			const fs = require('fs');
			fs.writeFileSync('pixels-list.json', json);
		}
	}

	async fillOpenSeaUrls(): Promise<void> {
		await this.connection.manager.transaction(async (transaction) => {
			await Promise.all(
				links.map(async (el) => {
					await transaction.update(
						PixelEntity,
						{ numericId: el.numericId },
						{ openseaUrl: el.url },
					);
				}),
			);
		});
	}
}
