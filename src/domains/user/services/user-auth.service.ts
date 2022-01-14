import * as uuid from 'uuid';
import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';

import { AUTH_SALT } from '../../../config';
import { generateToken } from '../../../common/utils/generate-token';

import { UserRepository } from '../persistance/user.repository';
import { UserEntity } from '../../../models';

import { AuthDto } from '../../../api/auth/dto/auth.dto';
import { encrypt } from '../../../common/utils/encrypt-decrypt';
import { CoinDomain } from '../../coin/coin.domain';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly coinDomain: CoinDomain,
  ) {}

  async authenticateService(props: AuthDto) {
    const row = await this.userRepository.findOne({
      where: {
        email: props.email,
      },
    });

    let user: UserEntity;
    let updateUsername: boolean;

    if (!row) {
      const username = 'pixold_user_' + uuid.v4();

      user = await this.userRepository.save(
        this.userRepository.create({
          username,
          accessToken: crypto
            .createHash('sha256')
            .update(AUTH_SALT + uuid.v4())
            .digest('hex'),
          lastLogin: new Date(),
          avatarUrl:
            props.avatarUrl || 'https://api.pixold.xyz/default-avatar.jpg',
          ...props,
        }),
      );

      updateUsername = true;
    } else {
      user = row;

      updateUsername = false;

      user.lastLogin = new Date();

      await this.userRepository.save(user);
    }

    return {
      userId: user.id,
      accessToken: await encrypt(
        user.id + '$' + generateToken(user.email, user.accessToken),
      ),
      updateUsername,
      wallet: await this.coinDomain.getWallet(user.id, false),
    };
  }
}
