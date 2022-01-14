import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PixoldAuthGuard } from '../../common/guards/auth.guard';
import { CoinModule } from '../coin/coin.module';

import { UserRepository } from './persistance/user.repository';
import { UserAuthService } from './services/user-auth.service';
import { UserService } from './services/user.service';

import { UserDomain } from './user.domain';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), CoinModule],
  exports: [UserDomain, PixoldAuthGuard],
  providers: [UserDomain, UserAuthService, UserService, PixoldAuthGuard],
})
export class UserModule {}
