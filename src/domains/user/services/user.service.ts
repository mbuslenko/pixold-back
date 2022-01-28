import * as uuid from 'uuid';
import * as crypto from 'crypto';

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Connection, FindOneOptions } from 'typeorm';

import { AUTH_SALT } from '../../../config';

import { UserEntity } from '../../../models';
import { UserRepository } from '../persistance/user.repository';

@Injectable()
export class UserService {
  private logger = new Logger(`UserService`);

  constructor(
    private connection: Connection,
    private readonly userRepository: UserRepository,
  ) {}

  async findOne(options: FindOneOptions<UserEntity>): Promise<UserEntity> {
    return this.userRepository.findOne(options);
  }

  async updateUsername(id: string, username: string): Promise<void> {
    await this.userRepository.update({ id }, { username }).catch((e) => {
      throw new BadRequestException(e.message);
    });
  }

  async checkUsername(username: string): Promise<{ result: boolean }> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    return {
      result: !user,
    };
  }

  async getUserById(id: string): Promise<UserService.GetUserByIdResponse> {
    return this.userRepository.getUserInfoById(id);
  }

  @Cron('0 10 3 * * *')
  async updateUsersAccessTokenCron(): Promise<void> {
    this.logger.log('Updating users access tokens started');

    const users = await this.userRepository.find();

    await this.connection.transaction(async (transactionManager) => {
      await Promise.all(
        users.map(async (user) => {
          await transactionManager.save(UserEntity, {
            ...user,
            accessToken: crypto
              .createHash('sha256')
              .update(AUTH_SALT + uuid.v4())
              .digest('hex'),
          });
        }),
      );
    });

    this.logger.log('Updating users access tokens finished');
  }
}

export namespace UserService {
  export interface GetUserByIdResponse {
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    wallet: string;
  }
}
