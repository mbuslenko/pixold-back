import { Module } from '@nestjs/common';
import { SolanaApi } from './solana.service';

@Module({
	imports: [],
	providers: [SolanaApi],
	exports: [SolanaApi],
})
export class SolanaModule {}
