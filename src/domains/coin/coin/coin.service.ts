import { Injectable } from '@nestjs/common';

@Injectable()
export class CoinService {
  async getAmountInCoins(amountInUsd: number) {
    return amountInUsd * 3; // TODO: add exchange rates from stellar api (???)
  }
}
