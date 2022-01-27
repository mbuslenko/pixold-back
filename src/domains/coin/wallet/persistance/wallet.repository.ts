import { EntityRepository, Repository } from 'typeorm';

import { StellarAccountsEntity } from '../../../../models/stellar-accounts.entity';

@EntityRepository(StellarAccountsEntity)
export class WalletRepository extends Repository<StellarAccountsEntity> {
  async getWallet(userId: string): Promise<WalletRepository.GetWallet[]> {
    return this.query(`
    SELECT 
      SUM(sa.balance_in_xlm) as balance_in_xlm, 
      SUM(sa.balance_in_usd) as balance_in_usd,
      SUM(sa.balance_in_pxl) as balance_in_pxl,
      u.username
    FROM stellar_accounts sa 
    LEFT JOIN "user" u 
      ON sa.owner_id = u.id 
    WHERE u.id = '${userId}'::uuid
    GROUP BY u.username
    `);
  }
}

export namespace WalletRepository {
  export interface GetWallet {
    balance_in_xlm: number;
    balance_in_usd: number;
    balance_in_pxl: number;
    username: string;
  }
}
