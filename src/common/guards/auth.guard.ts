import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { UserRepository } from '../../domains/user/persistance/user.repository';
import { UserService } from '../../domains/user/services/user.service';
import { UserEntity } from '../../models';
import { generateToken } from '../utils/generate-token';

@Injectable()
export class PixoldAuthGuard implements CanActivate {
  private userRepository: UserRepository;

  constructor(private readonly connection: Connection) {
    this.userRepository = this.connection.getCustomRepository(UserRepository);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization, user } = request.headers;

    let userRow: UserEntity

    try {
      userRow = await this.userRepository
      .findOne({ where: { id: user } })
    } catch (e) {
      return false
    }

    if (!userRow) {
      return false;
    }

    const accessToken = generateToken(userRow.email, userRow.accessToken);

    if (accessToken !== authorization) {
      return false;
    } else {
      return true;
    }
  }
}
