import { HttpException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserIdDto } from '../../../api/wallet/dto/wallet.dto';
import { sendNotification } from '../../../common/utils/telegram-notifications';
import { SolanaApi } from '../../solana/solana.service';
import { WalletRepository } from './persistance/wallet.repository';

export class WalletService {
	constructor(
		private readonly walletRepository: WalletRepository,
		private readonly solanaApi: SolanaApi,
	) {}

	async generateWallet(props: UserIdDto) {
		const { userId } = props;

		const row = await this.walletRepository.findOne({
			where: {
				ownerId: userId,
			},
		});

		if (row) {
			throw new HttpException(
				{ message: 'Such a user has already connected a wallet' },
				400,
			);
		}

		const wallet = await this.solanaApi.generateAccount();
		await this.walletRepository.save(
			this.walletRepository.create({
				ownerId: userId,
				publicKey: wallet.publicKey,
				secretKey: wallet.secretKey,
			}),
		);

		return {
			publicKey: wallet.publicKey,
		};
	}

	async getWallet(props: UserIdDto, throwError: boolean) {
		const { userId } = props;

		const wallet = await this.walletRepository.findOne({
			where: {
				id: userId,
			},
		});

		if (!wallet && throwError) {
			throw new HttpException({ message: 'Wallet not found' }, 400);
		}

		return this.solanaApi.getAccountBalance(wallet.publicKey);
	}

	async sendCoinsToUser(userId: string, coins: number): Promise<void> {
		const userWallet = await this.walletRepository.findOne({
			where: {
				ownerId: userId,
			},
		});

		if (!userWallet) {
			throw new HttpException(
				{ message: `You don't have wallet to send coins` },
				400,
			);
		}

		const pixoldWallet = await this.walletRepository.findOne({
			where: {
				ownerId: '6370046c-ac93-4d19-a55f-c59c5d5211b3',
			},
		});

		await this.solanaApi.sendPxlCoins({
			senderPublicKey: pixoldWallet.publicKey,
			senderSecretKey: pixoldWallet.secretKey,
			recipientPublicKey: userWallet.publicKey,
			amount: coins,
		});
	}

	async sendCoinsToPixold(userId: string, coins: number): Promise<void> {
		const userWallet = await this.walletRepository.findOne({
			where: {
				ownerId: userId,
			},
		});

		if (!userWallet) {
			throw new HttpException(
				{ message: `You don't have wallet to send coins` },
				400,
			);
		}

		const pixoldWallet = await this.walletRepository.findOne({
			where: {
				ownerId: '6370046c-ac93-4d19-a55f-c59c5d5211b3',
			},
		});

		await this.solanaApi.sendPxlCoins({
			senderPublicKey: userWallet.publicKey,
			senderSecretKey: userWallet.secretKey,
			recipientPublicKey: pixoldWallet.publicKey,
			amount: coins,
		});
	}

	@Cron(CronExpression.EVERY_2_HOURS)
	async checkPixoldBalance(): Promise<void> {
		const pixoldWallet = await this.walletRepository.findOne({
			where: {
				ownerId: '6370046c-ac93-4d19-a55f-c59c5d5211b3',
			},
		});

		if (!pixoldWallet) {
			throw new HttpException(
				{ message: `You don't have wallet to send coins` },
				400,
			);
		}

		const balances = await this.solanaApi.getAccountBalance(
			pixoldWallet.publicKey,
		);

		if (balances.pxlBalance < 10000) {
			sendNotification(
				`@mbuslenko, @myroslavvv, There are less than 10,000 PXL left on Pixold`,
			);
		} else if (balances.pxlBalance < 1000) {
			sendNotification(
				`@mbuslenko, @myroslavvv, There are less than 1,000 PXL left on Pixold`,
			);
		}
	}
}
