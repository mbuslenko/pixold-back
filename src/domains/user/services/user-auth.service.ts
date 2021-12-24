import * as uuid from 'uuid';
import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common'

import { AUTH_SALT } from '../../../config';
import { generateToken } from '../../../common/utils/generate-token';


import { UserRepository } from '../persistance/user.repository';
import { UserEntity } from '../../../models';

import { AuthDto } from '../../../api/auth/dto/auth.dto';

@Injectable()
export class UserAuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async authenticateService(props: AuthDto) {
    const row = await this.userRepository.findOne({
      where: {
        email: props.email,
      },
    });

    let user: UserEntity;

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
          ...props,
        }),
      );
    } else {
      user = row;
    }

    return {
      id: user.id,
      accessToken: generateToken(user.email, user.accessToken),
    };
  }
}
