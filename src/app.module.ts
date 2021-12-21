import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dbConfig } from './config/db.config';
import { UserModule } from './domains/user/user.module';

import * as api from './api';

import { AuthModule } from './auth/auth.module';
import { GlobalModule } from './global.module';
import { APP_GUARD } from '@nestjs/core';
import { PixoldAuthGuard } from './common/guards/auth.guard';
import { PixelModule } from './domains/pixel/pixel.module';
import { FaqModule } from './domains/faq/faq.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    GlobalModule,
    UserModule,
    AuthModule,
    // PixelModule, TODO: enable this when we will have a proper solution for the pixel map
    FaqModule,
  ],
  controllers: [
    api.UserController, api.GoogleController, api.FaqController,
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: PixoldAuthGuard,
    // },
  ],
})
export class AppModule {}
