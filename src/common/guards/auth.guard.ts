import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Connection } from 'typeorm';
import { NODE_ENV } from '../../config';

import { UserRepository } from '../../domains/user/persistance/user.repository';
import { UserEntity } from '../../models';

import { decrypt } from '../utils/encrypt-decrypt';
import { generateToken } from '../utils/generate-token';

@Injectable()
export class PixoldAuthGuard implements CanActivate {
  private userRepository: UserRepository;

  constructor(private readonly connection: Connection) {
    this.userRepository = this.connection.getCustomRepository(UserRepository);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    if (!authorization) {
      return false;
    }

    const decryptedHeader = await decrypt(authorization);
    const [userId, authToken] = decryptedHeader.split('$');

    let userRow: UserEntity;

    try {
      userRow = await this.userRepository.findOne({ where: { id: userId } });
    } catch (e) {
      return false;
    }

    if (!userRow) {
      return false;
    }

    const accessToken = generateToken(userRow.email, userRow.accessToken);

    if (accessToken !== authToken) {
      return false;
    } else {
      request.user = { uid: userId };

      return true;
    }
  }
}
