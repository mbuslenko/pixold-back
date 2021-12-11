import { Column, Entity } from 'typeorm';
import { PixoldBaseEntity } from '../common/db/base-entity';

@Entity()
export class UserEntity extends PixoldBaseEntity<UserEntity> {
    @Column({ unique: true })
    username: string;

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ name: 'last_logined_at', type: 'timestamp' })
    lastLogin: Date;

    @Column({ name: 'avatar_url' })
    avatarUrl: string;

    @Column({ name: 'access_token' })
    accessToken: string;
}
