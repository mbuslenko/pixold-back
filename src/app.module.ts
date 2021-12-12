import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dbConfig } from './config/db.config';
import { UserModule } from './domains/user/user.module';

import * as api from './api';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from '@nestjs/passport';
import { GlobalModule } from './global.module';
import { APP_GUARD } from '@nestjs/core';
import { PixoldAuthGuard } from './common/guards/auth.guard';
import { UserService } from './domains/user/services/user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    GlobalModule,
    UserModule,
    AuthModule,
  ],
  controllers: [
    api.UserController, api.GoogleController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PixoldAuthGuard,
    },
  ],
})
export class AppModule {}
