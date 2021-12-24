import { EntityRepository, Repository } from 'typeorm';

import { StellarAccountsEntity } from '../../../../models/stellar-accounts.entity';

@EntityRepository(StellarAccountsEntity)
export class WalletRepository extends Repository<StellarAccountsEntity> {}
