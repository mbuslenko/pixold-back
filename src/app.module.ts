import { join } from 'path';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';

import { dbConfig } from './config/db.config';
import { UserModule } from './domains/user/user.module';

import * as api from './api';

import { AuthModule } from './auth/auth.module';
import { GlobalModule } from './global.module';
import { PixelModule } from './domains/pixel/pixel.module';
import { FaqModule } from './domains/faq/faq.module';
import { CoinModule } from './domains/coin/coin.module';
import { EventsModule } from './events/events.module';
import { NotificationsModule } from './domains/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ScheduleModule.forRoot(),
    GlobalModule,
    UserModule,
    AuthModule,
    PixelModule,
    FaqModule,
    CoinModule,
    EventsModule,
    NotificationsModule,
  ],
  controllers: [
    api.UserController,
    api.FaqController,
    api.WalletController,
    api.AuthController,
    api.PixelController,
    api.NotifcationsController,
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: PixoldAuthGuard,
    // },
  ],
})
export class AppModule {}
