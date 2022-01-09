import { Injectable } from '@nestjs/common';

@Injectable()
export class CoinService {
  async getAmountInCoins(amountInUsd: number) {
    return amountInUsd * 0.01; // TODO: get exchange rate
  }
}
