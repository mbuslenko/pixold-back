import { Injectable } from '@nestjs/common';
import { Auth } from '../../../auth/auth.namespace';
import { UserRepository } from '../persistance/user.repository';
import * as uuid from 'uuid';
import { UserEntity } from '../../../models';
import * as crypto from 'crypto';
import { AUTH_SALT } from '../../../config';
import { generateToken } from '../../../common/utils/generate-token';

@Injectable()
export class UserAuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async authenticateService(props: Auth.GoogleRedirectResponse) {
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
          email: props.email,
          firstName: props.firstName,
          lastName: props.lastName,
          avatarUrl: props.picture,
          lastLogin: new Date(),
          accessToken: crypto
            .createHash('sha256')
            .update(AUTH_SALT + uuid.v4())
            .digest('hex'),
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
