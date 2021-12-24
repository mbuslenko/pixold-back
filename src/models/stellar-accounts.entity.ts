import { Column, Entity } from 'typeorm';
import { PixoldBaseEntity } from '../common/db/base-entity';

@Entity('stellar_accounts')
export class StellarAccountsEntity extends PixoldBaseEntity<StellarAccountsEntity> {
  @Column({ name: 'public_key', unique: true })
  publicKey: string;

  @Column({ name: 'secret_key' })
  secretKey: string;

  @Column({ type: 'real' })
  sequence: number;

  @Column({ name: 'balance_in_usd', type: 'real' })
  balanceInUSD: number;

  @Column({ name: 'balance_in_xlm', type: 'real' })
  balanceInXLM: number;

  @Column({ name: 'owner_id', type: 'uuid' })
  ownerId: string;
}
