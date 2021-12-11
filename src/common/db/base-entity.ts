import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class PixoldBaseEntity<T> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }
}
