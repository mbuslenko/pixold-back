import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { performance } from 'perf_hooks';
import { Connection, Repository } from 'typeorm';

import { AttackHexagonDto } from '../../../api/pixel/dto/pixel.dto';
import { PixelLevelsEnum } from '../../../common/consts/level.enum';
import { sendNotification } from '../../../common/utils/telegram-notifications';
import { PixelTypes } from '../../../common/consts/pixel-types.type';

import { CoinDomain } from '../../coin/coin.domain';
import { EventsGateway } from '../../../events/events.gateway';

import { PixelRepository } from '../persistance/pixel.repository';
import { AttackPixelRepository } from '../persistance/types/attack-pixel.repository';
import { MinerPixelRepository } from '../persistance/types/miner-pixel.repository';
import { DefenderPixelRepository } from '../persistance/types/defender-pixel.repository';
import { AttacksEntity } from '../../../models';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(AttacksEntity)
		private readonly attacksRepository: Repository<AttacksEntity>,
		private readonly pixelRepository: PixelRepository,
		private readonly minerPixelRepository: MinerPixelRepository,
		private readonly attackPixelRepository: AttackPixelRepository,
		private readonly defenderPixelRepository: DefenderPixelRepository,

		private readonly coinDomain: CoinDomain,
		private readonly eventsGateway: EventsGateway,

		private readonly connection: Connection,
	) {}

	@Cron('45 * * * * *')
	async miningCron(): Promise<void> {
		const miners = await this.minerPixelRepository.find({
			select: ['numericId'],
		});

		await Promise.all(
			miners.map(async (el) => {
				await this.mine(el.numericId);
			}),
		);
	}

	// TODO: Refactor this function to reduce its Cognitive Complexity from 86 to the 15 allowed.
	async attackHexagon(userId: string, props: AttackHexagonDto): Promise<void> {
		// TODO: change to transaction
		const start = performance.now();

		const attackerRow = await this.attackPixelRepository.findOne({
			where: { numericId: props.from },
		});

		const attackerPixel = await this.pixelRepository.findOne({
			where: { numericId: props.from },
		});

		const attackedPixel = await this.pixelRepository.findOne({
			where: { numericId: props.to },
		});

		const attack = await this.attacksRepository.save(
			this.attacksRepository.create({
				attackedX: attackedPixel.xCoordinate,
				attackedY: attackedPixel.yCoordinate,
				attackerX: attackerPixel.xCoordinate,
				attackerY: attackerPixel.yCoordinate,
				finished: false,
			}),
		);

		this.eventsGateway.sendMessageForMap({
			from: attackerPixel.numericId,
			to: attackedPixel.numericId,
			attack: 'started',
		});

		const attackedHexagons: GameService.PixelInfo[] =
			await this.pixelRepository.find({
				select: ['numericId', 'type', 'xCoordinate', 'yCoordinate'],
				where: { ownerId: attackedPixel.ownerId },
			});

		const closestHexagonId = this.findClosestHexagon(
			{
				xCoordinate: attackerPixel.xCoordinate,
				yCoordinate: attackerPixel.yCoordinate,
			},
			attackedHexagons,
		);

		const closestHexagonRow = await this.pixelRepository.findOne({
			where: { numericId: closestHexagonId },
		});

		const distance = this.calculateDistance(attackerPixel, closestHexagonRow);
		const hexagonsNumber = attackedHexagons.length;

		let percentRobbed = 0;
		let timeForAttackInSeconds = distance * 2;
		let attackSuccess = false;

		// TODO: refactor if & switch cases
		if (closestHexagonRow.type === 'defender') {
			const defenderRow = await this.defenderPixelRepository.findOne({
				where: { numericId: closestHexagonId },
			});

			switch (attackerRow.level) {
				case PixelLevelsEnum.STARTER:
					percentRobbed = Math.floor(Math.random() * 15) + 15;

					switch (defenderRow.level) {
						case PixelLevelsEnum.STARTER:
							timeForAttackInSeconds += hexagonsNumber * 60 + 5 * 60;

							// with 30% chance set attack success to true
							if (Math.random() * 100 < 50) {
								attackSuccess = true;
							}
							break;
						case PixelLevelsEnum.MIDDLE:
							timeForAttackInSeconds += hexagonsNumber * 60 + 10 * 60;

							if (Math.random() * 100 < 30) {
								attackSuccess = true;
							}
							break;
						case PixelLevelsEnum.PRO:
							timeForAttackInSeconds += hexagonsNumber * 60 + 15 * 60;

							if (Math.random() * 100 < 10) {
								attackSuccess = true;
							}
							break;
						case PixelLevelsEnum.SUPREME:
							timeForAttackInSeconds += hexagonsNumber * 60 + 25 * 60;

							if (Math.random() * 100 < 2) {
								attackSuccess = true;
							}
					}
					break;
				case PixelLevelsEnum.MIDDLE:
					percentRobbed = Math.floor(Math.random() * 20) + 30;

					switch (defenderRow.level) {
						case PixelLevelsEnum.STARTER:
							timeForAttackInSeconds += hexagonsNumber * 60 + 2 * 60;

							if (Math.random() * 100 < 70) {
								attackSuccess = true;
							}
							break;
						case PixelLevelsEnum.MIDDLE:
							timeForAttackInSeconds += hexagonsNumber * 60 + 5 * 60;

							if (Math.random() * 100 < 50) {
								attackSuccess = true;
							}
							break;
						case PixelLevelsEnum.PRO:
							timeForAttackInSeconds += hexagonsNumber * 60 + 10 * 60;

							if (Math.random() * 100 < 30) {
								attackSuccess = true;
							}
							break;
						case PixelLevelsEnum.SUPREME:
							timeForAttackInSeconds += hexagonsNumber * 60 + 15 * 60;

							if (Math.random() * 100 < 10) {
								attackSuccess = true;
							}
					}
					break;

				case PixelLevelsEnum.PRO:
					percentRobbed = Math.floor(Math.random() * 30) + 50;

					switch (defenderRow.level) {
						case PixelLevelsEnum.STARTER:
							timeForAttackInSeconds += hexagonsNumber * 60 + 1 * 60;

							if (Math.random() * 100 < 90) {
								attackSuccess = true;
							}
							break;
						case PixelLevelsEnum.MIDDLE:
							timeForAttackInSeconds += hexagonsNumber * 60 + 2 * 60;

							if (Math.random() * 100 < 70) {
								attackSuccess = true;
							}
							break;
						case PixelLevelsEnum.PRO:
							timeForAttackInSeconds += hexagonsNumber * 60 + 5 * 60;

							if (Math.random() * 100 < 50) {
								attackSuccess = true;
							}
							break;
						case PixelLevelsEnum.SUPREME:
							timeForAttackInSeconds += hexagonsNumber * 60 + 10 * 60;

							if (Math.random() * 100 < 30) {
								attackSuccess = true;
							}
					}
					break;

				case PixelLevelsEnum.SUPREME:
					percentRobbed = Math.floor(Math.random() * 50) + 75;

					switch (defenderRow.level) {
						case PixelLevelsEnum.STARTER:
							timeForAttackInSeconds += hexagonsNumber * 60 + 1 * 60;

							if (Math.random() * 100 < 95) {
								attackSuccess = true;
							}
							break;
						case PixelLevelsEnum.MIDDLE:
							timeForAttackInSeconds += hexagonsNumber * 60 + 1 * 60;

							if (Math.random() * 100 < 85) {
								attackSuccess = true;
							}
							break;
						case PixelLevelsEnum.PRO:
							timeForAttackInSeconds += hexagonsNumber * 60 + 1 * 60;

							if (Math.random() * 100 < 70) {
								attackSuccess = true;
							}
							break;
						case PixelLevelsEnum.SUPREME:
							timeForAttackInSeconds += hexagonsNumber * 60 + 1 * 60;

							if (Math.random() * 100 < 50) {
								attackSuccess = true;
							}
					}
			}
		} else {
			switch (attackerRow.level) {
				case PixelLevelsEnum.STARTER:
					// random percent between 15 and 30
					percentRobbed = Math.floor(Math.random() * 15) + 15;
					timeForAttackInSeconds += hexagonsNumber * 60;
					break;
				case PixelLevelsEnum.MIDDLE:
					percentRobbed = Math.floor(Math.random() * 15) + 30;
					timeForAttackInSeconds += hexagonsNumber * 55;
					break;
				case PixelLevelsEnum.PRO:
					percentRobbed = Math.floor(Math.random() * 15) + 45;
					timeForAttackInSeconds += hexagonsNumber * 50;
					break;
				case PixelLevelsEnum.SUPREME:
					percentRobbed = Math.floor(Math.random() * 20) + 60;
					timeForAttackInSeconds += hexagonsNumber * 45;
					break;
			}
		}

		const coinsSubstracted =
			await this.minerPixelRepository.getSubstractedCoinsNumber(
				attackedPixel.ownerId,
				percentRobbed,
			);

		await this.minerPixelRepository.substractCoinsFromStorages(
			attackedPixel.ownerId,
			percentRobbed,
		);

		await this.coinDomain.sendCoinsToUser(
			attackerPixel.ownerId,
			coinsSubstracted,
		);

		await this.attackPixelRepository.substractHealth(attackedPixel.ownerId, 50);

		await this.defenderPixelRepository.substractHealth(
			attackedPixel.ownerId,
			50,
		);

		await this.attacksRepository.update({ id: attack.id }, { finished: true });

		const end = performance.now();

		const finalTimeForAttack = timeForAttackInSeconds - (end - start);

		if (finalTimeForAttack < 0) {
			if (attackSuccess === true) {
				return this.eventsGateway.sendAttackMessage({
					to: userId,
					type: 'success',
					message: `Your previous attack was successfully completed`,
				});
			}

			return this.eventsGateway.sendAttackMessage({
				to: userId,
				type: 'warning',
				message: `Your previous attack was failed`,
			});
		}

		if (attackSuccess === true) {
			setTimeout(() => {
				this.eventsGateway.sendAttackMessage({
					to: userId,
					type: 'success',
					message: `Your previous attack was successfully completed`,
				});
			}, finalTimeForAttack * 1000);
		}

		setTimeout(() => {
			this.eventsGateway.sendAttackMessage({
				to: userId,
				type: 'warning',
				message: `Your previous attack was failed`,
			});
		}, finalTimeForAttack * 1000);

		this.eventsGateway.sendMessageForMap({
			from: attackerPixel.numericId,
			to: attackedPixel.numericId,
			attack: 'ended',
		});
	}

	async mine(numericId: number) {
		const row = await this.minerPixelRepository.findOne({
			where: { numericId },
		});

		const { ownerId } = await this.pixelRepository.findOne({
			where: { numericId },
		});

		let percent = 0;

		switch (row.level) {
			case PixelLevelsEnum.STARTER:
				percent = 15;
				break;
			case PixelLevelsEnum.MIDDLE:
				percent = 30;
				break;
			case PixelLevelsEnum.MIDDLE:
				percent = 40;
				break;
			case PixelLevelsEnum.PRO:
				percent = 50;
				break;
			case PixelLevelsEnum.SUPREME:
				percent = 65;
		}

		let minedCoins = 0;
		if (this.willMine(percent)) {
			minedCoins = (Math.floor(Math.random() * 10) + 1) / 2;

			const check = await this.checkIfThereAreEnoughCoins(minedCoins);

			if (check) {
				await this.minerPixelRepository.update(
					{ numericId },
					{ coinsInStorage: row.coinsInStorage + minedCoins },
				);
			}
		}
	}

	willMine(percent: number): boolean {
		return Math.random() * 100 < percent;
	}

	async checkIfThereAreEnoughCoins(coins: number): Promise<boolean> {
		const coinsLeft = await this.coinDomain.getPixoldCoinsLeft();

		if (coinsLeft < 100) {
			sendNotification(
				`[ERROR] @mbuslenko @myroslavvv You have ${coinsLeft} coins left. Mining stopped for all accounts.`,
			);

			return;
		} else if (coinsLeft < 10_000) {
			sendNotification(`[WARNING] You have ${coinsLeft} coins left.`);
			return;
		}

		return coinsLeft > coins;
	}

	findClosestHexagon(
		from: GameService.PixelCoordinates,
		arr: GameService.PixelInfo[],
	): number {
		let minDistance = Infinity;
		let closestHexagon = -1;

		arr.forEach((el) => {
			const distance = this.calculateDistance(from, el);

			if (distance < minDistance) {
				minDistance = distance;
				closestHexagon = el.numericId;
			}
		});

		return closestHexagon;
	}

	calculateDistance(
		from: GameService.PixelCoordinates,
		to: GameService.PixelCoordinates,
	) {
		const x = from.xCoordinate - to.xCoordinate;
		const y = from.yCoordinate - to.yCoordinate;

		return Math.sqrt(x * x + y * y);
	}

	async getAllCoinsInUsersStorages(userId: string): Promise<{ sum: number }> {
		return this.minerPixelRepository.query(
			`SELECT SUM(coinsInStorage) FROM miner_pixels WHERE ownerId = '${userId}'`,
		);
	}

	async repairHexagon(numericId: number, userId: string) {
		const hexagon = await this.pixelRepository.findOne({
			where: { numericId },
		});

		if (hexagon.type === 'miner') {
			throw new BadRequestException('You can not repair miner hexagon');
		} else if (hexagon.ownerId !== userId) {
			throw new UnauthorizedException('You can not repair this hexagon');
		}

		// add logic here
		const coinsToRepair = 0.5;

		await this.coinDomain.sendCoinsToPixold(userId, coinsToRepair);
	}
}

export namespace GameService {
	export interface PixelInfo extends PixelCoordinates {
		numericId: number;
		type: PixelTypes;
	}

	export interface PixelCoordinates {
		xCoordinate: number;
		yCoordinate: number;
	}
}
