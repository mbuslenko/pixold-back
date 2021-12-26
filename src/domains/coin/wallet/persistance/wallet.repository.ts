import { EntityRepository, Repository } from 'typeorm';

import { StellarAccountsEntity } from '../../../../models/stellar-accounts.entity';

@EntityRepository(StellarAccountsEntity)
export class WalletRepository extends Repository<StellarAccountsEntity> {
  async getWallet(userId: string) {
    return this.query(`
    SELECT 
      SUM(sa.balance_in_xlm) as balance_in_xlm, 
      SUM(sa.balance_in_usd) as balance_in_usd,
      u.username
    FROM stellar_accounts sa 
    LEFT JOIN "user" u 
      ON sa.owner_id = u.id 
    WHERE u.id = '${userId}'::uuid
    GROUP BY u.username
    `);
  }
}
