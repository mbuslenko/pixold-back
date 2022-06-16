import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import * as web3 from '@solana/web3.js';
import * as splToken from '@solana/spl-token';
import axios from 'axios';
import * as bs58 from 'bs58';

@Injectable()
export class SolanaApi {
	private connection = new web3.Connection(
		web3.clusterApiUrl('mainnet-beta'),
		'confirmed',
	);

	async generateAccount() {
		const keypair = web3.Keypair.generate();

		const publicKey = keypair.publicKey.toBase58();
		const secretKey = bs58.encode(keypair.secretKey);

		return {
			publicKey,
			secretKey,
		};
	}

	async getAccountBalance(publicKey: string) {
		const splTokenAccount = await this.rpcRequest<
			SolanaApi.AxiosResponse<SolanaApi.AccountInfoResponse>
		>({
			method: 'getTokenAccountsByOwner',
			params: [
				publicKey,
				{
					mint: '2JyQ9dWy9dRmQ8GqcHsKW7AmET7N95QfY3xAHSSG6HrF',
				},
				{
					encoding: 'jsonParsed',
				},
			],
		});
		let pxlBalance = 0;
		if (splTokenAccount.data.result.value.length > 0) {
			pxlBalance =
				splTokenAccount.data.result.value[0].account.data.parsed.info
					.tokenAmount.uiAmount;
		}

		let solBalance = await this.connection.getBalance(
			this.generatePublicKeyClass(publicKey),
		);
		solBalance = solBalance / 1000000000;

		return {
			pxlBalance,
			solBalance,
			usdBalance: 0, // Remains of the old logic
		};
	}

	async sendPxlCoins(props: {
		senderPublicKey: string;
		senderSecretKey: string;
		recipientPublicKey: string;
		amount: number;
	}): Promise<string> {
		const senderUInt8ArraySecretKey = bs58.decode(props.senderSecretKey);
		const senderKeypair = web3.Keypair.fromSecretKey(senderUInt8ArraySecretKey);
		const senderPublicKeyClass = this.generatePublicKeyClass(
			props.senderPublicKey,
		);
		const recipientPublicKeyClass = this.generatePublicKeyClass(
			props.recipientPublicKey,
		);

		const pxlCoinPublicKeyClass = this.generatePublicKeyClass(
			'2JyQ9dWy9dRmQ8GqcHsKW7AmET7N95QfY3xAHSSG6HrF',
		);

		const senderAccount = await splToken.getOrCreateAssociatedTokenAccount(
			this.connection,
			senderKeypair,
			pxlCoinPublicKeyClass,
			senderPublicKeyClass,
		);

		const recipientAccount = await splToken.getOrCreateAssociatedTokenAccount(
			this.connection,
			senderKeypair,
			pxlCoinPublicKeyClass,
			recipientPublicKeyClass,
		);

		return splToken.transfer(
			this.connection,
			senderKeypair,
			senderAccount.address,
			recipientAccount.address,
			senderKeypair,
			props.amount * 1000000000,
		);
	}

	private generatePublicKeyClass(publicKey: string): web3.PublicKey {
		try {
			return new web3.PublicKey(publicKey);
		} catch (e) {
			throw new BadRequestException({
				message: `The public key provided is invalid`,
			});
		}
	}

	private async rpcRequest<T>(props: {
		method: string;
		params: any;
	}): Promise<T> {
		const url = 'https://api.mainnet-beta.solana.com';
		const data = {
			jsonrpc: '2.0',
			id: 1,
			method: props.method,
			params: props.params,
		};

		return axios.request({
			url,
			method: 'POST',
			data,
		});
	}
}

export namespace SolanaApi {
	export interface AxiosResponse<T> {
		data: T;
	}

	export interface Context {
		slot: number;
	}

	export interface TokenAmount {
		amount: string;
		decimals: number;
		uiAmount: number;
		uiAmountString: string;
	}

	export interface TokenInfo {
		isNative: boolean;
		mint: string;
		owner: string;
		state: string;
		tokenAmount: TokenAmount;
	}

	export interface AccountParsed {
		info: TokenInfo;
		type: string;
	}

	export interface AccountData {
		parsed: AccountParsed;
		program: string;
		space: number;
	}

	export interface Account {
		data: AccountData;
		executable: boolean;
		lamports: number;
		owner: string;
		rentEpoch: number;
	}

	export interface AccountInfoValue {
		account: Account;
		pubkey: string;
	}

	export interface AccountInfoResult {
		context: Context;
		value: AccountInfoValue[];
	}

	export interface AccountInfoResponse {
		jsonrpc: string;
		result: AccountInfoResult;
		id: number;
	}
}
