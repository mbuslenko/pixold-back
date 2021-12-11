import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../domains/user/persistance/user.repository';
import { generateToken } from '../utils/generate-token';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization, user } = request.headers;

    const userRow = await this.userRepository.findOne({ id: user });

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
