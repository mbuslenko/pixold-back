import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dbConfig } from './config/db.config';
import { UserModule } from './domains/user/user.module';

import * as api from './api';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    UserModule,
  ],
  controllers: [
    api.UserController,
  ],
  providers: [],
})
export class AppModule {}
