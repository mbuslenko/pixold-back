import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dbConfig } from './config/db.config';
import { UserModule } from './domains/user/user.module';

import * as api from './api';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    UserModule,
    AuthModule,
  ],
  controllers: [
    api.UserController, api.GoogleController,
  ],
  providers: [],
})
export class AppModule {}
