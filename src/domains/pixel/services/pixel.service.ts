import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { Connection, Repository } from 'typeorm';

import { PixelLevelsEnum } from '../../../common/consts/level.enum';
import { PixelTypes } from '../../../common/consts/pixel-types.type';
import { generateRandomColor } from '../../../common/utils/generate-color';
import { AttacksEntity } from '../../../models';

import { CoinDomain } from '../../coin/coin.domain';
import { NotificationsDomain } from '../../notifications/notifications.domain';
import { UserDomain } from '../../user/user.domain';

import { PixelRepository } from '../persistance/pixel.repository';
import { AttackPixelRepository } from '../persistance/types/attack-pixel.repository';
import { DefenderPixelRepository } from '../persistance/types/defender-pixel.repository';
import { MinerPixelRepository } from '../persistance/types/miner-pixel.repository';

@Injectable()
export class PixelService {
	constructor(
		private readonly connection: Connection,

		@InjectRepository(AttacksEntity)
		private readonly attacksRepository: Repository<AttacksEntity>,
		private readonly pixelRepository: PixelRepository,
		private readonly coinDomain: CoinDomain,
		private readonly userDomain: UserDomain,
		private readonly notificationsDomain: NotificationsDomain,

		private readonly minerPixelRepository: MinerPixelRepository,
		private readonly attackPixelRepository: AttackPixelRepository,
		private readonly defenderPixelRepository: DefenderPixelRepository,
	) {}

	// ! TESTING PURPOSES ONLY
	async buyHexagon(userId: string, numericId: number) {
		return this.pixelRepository.update({ numericId }, { ownerId: userId });
	}

	async getAllAttacks() {
		const attacks = await this.attacksRepository.find();

		return attacks.map(async (el) => {
			const { ownerId: userId } = await this.pixelRepository.findOne({
				where: { xCoordinate: el.attackerX, yCoordinate: el.attackedY },
			});

			return {
				from: [el.attackerX, el.attackerY],
				to: [el.attackedX, el.attackedY],
				userId,
			};
		});
	}

	async getAllPixelsOwnedByUsers(): Promise<
		PixelService.GetAllPixelsResponse[]
	> {
		const owners = await this.pixelRepository.getOwnersList();

		const result = [];

		await Promise.all(
			owners.map(async (ownerId) => {
				await this.connection.manager.transaction(
					async (transactionManager) => {
						if (ownerId != 'pixold') {
							const ownersPixels = await transactionManager.query(
								`SELECT numeric_id FROM pixel WHERE owner_id = '${ownerId}'`,
							);

							const username = (await this.userDomain.getUserById(ownerId))
								.username;

							const numericIds = ownersPixels.map((el) => el.numeric_id);

							result.push({
								username,
								numericIds,
							});
						}
					},
				);
			}),
		);

		return result;
	}

	async getAllPixels() {
		const owners = await this.pixelRepository.getOwnersList();

		const rows = [];

		await Promise.all(
			owners.map(async (el) => {
				const color =
					el.owner_id === 'pixold' ? '#2D3436' : generateRandomColor();

				const ownersPixels = await this.pixelRepository.find({
					select: ['numericId'],
					where: { ownerId: el.owner_id },
				});

				ownersPixels.forEach((el) => {
					rows.push({
						color,
						...el,
					});
				});
			}),
		);

		return rows;
	}

	async redeemCode(userId: string, redemptionCode: string) {
		const pixel = await this.pixelRepository.findOne({
			where: { redemptionCode },
		});

		if (!pixel) {
			throw new BadRequestException({ message: 'Invalid code' });
		} else if (pixel.ownerId == userId) {
			throw new BadRequestException({
				message: 'You already own this hexagon',
			});
		}

		pixel.ownerId = userId;

		await this.pixelRepository.save(pixel);
	}

	async getAmountOfCoinsToUpgrade(
		type: 'attack' | 'miner' | 'defender' | 'without',
		actualLevel: PixelLevelsEnum,
	) {
		let priceInUsd = 0;

		switch (actualLevel) {
			case PixelLevelsEnum.STARTER:
				switch (type) {
					case 'attack':
						priceInUsd = 30;
						break;
					case 'miner':
						priceInUsd = 50;
						break;
					case 'defender':
						priceInUsd = 100;
				}
				break;
			case PixelLevelsEnum.MIDDLE:
				switch (type) {
					case 'attack':
						priceInUsd = 50;
						break;
					case 'miner':
						priceInUsd = 100;
						break;
					case 'defender':
						priceInUsd = 200;
				}
				break;
			case PixelLevelsEnum.PRO:
				switch (type) {
					case 'attack':
						priceInUsd = 100;
						break;
					case 'miner':
						priceInUsd = 200;
						break;
					case 'defender':
						priceInUsd = 400;
				}
		}

		return this.coinDomain.getAmountInCoins(priceInUsd);
	}

	async changeType(
		numericId: number,
		type: PixelTypes,
		userId: string,
	): Promise<void> {
		const row = await this.pixelRepository.findOne({ where: { numericId } });

		if (row.ownerId !== userId) {
			throw new BadRequestException({
				message: 'You can not change type of other user hexagon',
			});
		}

		await this.pixelRepository.clearTypeForHexagon(numericId);

		switch (type) {
			case 'attack':
				await this.attackPixelRepository.save(
					this.attackPixelRepository.create({
						numericId,
						level: PixelLevelsEnum.STARTER,
					}),
				);
				break;
			case 'miner':
				await this.minerPixelRepository.save(
					this.minerPixelRepository.create({
						numericId,
						level: PixelLevelsEnum.STARTER,
						coinsInStorage: 0,
					}),
				);
				break;
			case 'defender':
				await this.defenderPixelRepository.save(
					this.defenderPixelRepository.create({
						numericId,
						level: PixelLevelsEnum.STARTER,
					}),
				);
				break;
		}

		await this.pixelRepository.update({ numericId }, { type });
	}

	async getHexagonInfo(
		numericId: number,
		userId: string,
	): Promise<PixelService.HexagonInfo> {
		const hexagonRow = await this.pixelRepository.findOne({
			where: { numericId },
		});

		if (!hexagonRow) {
			throw new BadRequestException({ message: 'Hexagon not found' });
		}

		if (hexagonRow.ownerId === 'pixold') {
			return {
				type: 'without',
				level: PixelLevelsEnum.STARTER,
				coinsInStorage: 0,
				owner: 'pixold',
				canAttack: false,
				coinsToUpgrade: 0,
				isNotSubscribedOnNotifications: {
					isAttacked: null,
					fullStorage: null,
				},
			};
		}

		const ownerUsername = (
			await this.userDomain.getUserById(hexagonRow.ownerId)
		).username;

		let typeRow: any;

		switch (hexagonRow.type) {
			case 'miner':
				typeRow = await this.minerPixelRepository.findOne({
					where: { numericId },
				});
				break;
			case 'attack':
				typeRow = await this.attackPixelRepository.findOne({
					where: { numericId },
				});
				break;
			case 'defender':
				typeRow = await this.defenderPixelRepository.findOne({
					where: { numericId },
				});
				break;
			case 'without':
				typeRow = { level: PixelLevelsEnum.STARTER };
		}

		return {
			type: hexagonRow.type,
			level: typeRow.level,
			coinsInStorage: typeRow.coinsInStorage ?? null,
			health: typeRow.health ?? null,
			owner: ownerUsername,
			canAttack: hexagonRow.ownerId !== userId,
			coinsToUpgrade: await this.getAmountOfCoinsToUpgrade(
				hexagonRow.type,
				typeRow.level,
			),
			isNotSubscribedOnNotifications: {
				isAttacked: await this.notificationsDomain.checkIsNotSubscribed(
					userId,
					'is-attacked',
				),
				fullStorage: await this.notificationsDomain.checkIsNotSubscribed(
					userId,
					'full-storage',
				),
			},
		};
	}

	async getRandomFreeHexagon(): Promise<PixelService.GetRandomFreeHexagon> {
		const [{ numeric_id: numericId }] =
			await this.pixelRepository.getOneRandomFreeHexagon();

		return {
			name: 'hexagon#' + numericId,
			bid: '100$',
			purchaseLink:
				'https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/53812526196032344565437183040714628674999174739090954850032801003187019448321',
		};
	}

	async upgradeHexagon(userId: string, numericId: number): Promise<void> {
		const hexagonRow = await this.pixelRepository.findOne({
			where: { numericId },
		});

		let typeRow;
		switch (hexagonRow.type) {
			case 'miner':
				typeRow = await this.minerPixelRepository.findOne({
					where: { numericId },
				});
				break;
			case 'attack':
				typeRow = await this.attackPixelRepository.findOne({
					where: { numericId },
				});
				break;
			case 'defender':
				typeRow = await this.defenderPixelRepository.findOne({
					where: { numericId },
				});
				break;
			case 'without':
				throw new BadRequestException({
					message: 'You can not upgrade hexagon without type',
				});
		}

		const coinsToUpgrade = await this.getAmountOfCoinsToUpgrade(
			hexagonRow.type,
			typeRow.level,
		);

		await this.coinDomain.sendCoinsToPixold(userId, coinsToUpgrade);

		let newLevel;

		switch (typeRow.level) {
			case PixelLevelsEnum.STARTER:
				newLevel = PixelLevelsEnum.MIDDLE;
				break;
			case PixelLevelsEnum.MIDDLE:
				newLevel = PixelLevelsEnum.PRO;
				break;
			case PixelLevelsEnum.PRO:
				newLevel = PixelLevelsEnum.PRO;
				break;
			case PixelLevelsEnum.SUPREME:
				throw new BadRequestException({
					message: 'You are already at the maximum level of the hexagon',
				});
		}

		switch (hexagonRow.type) {
			case 'miner':
				await this.minerPixelRepository.update(
					{ numericId },
					{ level: newLevel },
				);
				break;
			case 'attack':
				await this.attackPixelRepository.update(
					{ numericId },
					{ level: newLevel },
				);
				break;
			case 'defender':
				await this.defenderPixelRepository.update(
					{ numericId },
					{ level: newLevel },
				);
				break;
		}
	}

	async sendCoinsFromMinerToWallet(
		numericId: number,
		userId: string,
	): Promise<void> {
		const minerPixelRow = await this.minerPixelRepository.findOne({
			where: { numericId },
		});

		if (!minerPixelRow) {
			throw new BadRequestException({
				message: 'Miner hexagon was not found',
			});
		}

		const coinsInStorage = minerPixelRow.coinsInStorage;

		const { ownerId } = await this.pixelRepository.findOne({
			where: { numericId },
		});

		if (ownerId !== userId) {
			throw new BadRequestException({
				message: 'You can not send coins from hexagon that is not yours',
			});
		}

		await this.minerPixelRepository.update(
			{ numericId },
			{ coinsInStorage: 0 },
		);

		await this.coinDomain.sendCoinsToUser(ownerId, coinsInStorage);
	}
}

export namespace PixelService {
	export interface HexagonInfo {
		type: PixelTypes;
		level: PixelLevelsEnum;
		coinsInStorage?: number;
		health?: number;
		owner: string;
		canAttack: boolean;
		coinsToUpgrade: number;
		isNotSubscribedOnNotifications: {
			isAttacked: boolean;
			fullStorage: boolean;
		};
	}

	export interface GetAllPixelsResponse {
		[key: string]: {
			numericId: number;
		}[];
	}

	export interface GetRandomFreeHexagon {
		name: string;
		bid: string;
		purchaseLink: string;
	}
}
