import { BadRequestException, Injectable } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { UserEntity } from '../../../models';
import { UserRepository } from '../persistance/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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
