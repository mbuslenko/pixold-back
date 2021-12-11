import { Module } from '@nestjs/common';

import { UserModule } from '../domains/user/user.module';

import { GoogleAuthService } from './google-auth.service';
import { GoogleStrategy } from './google.strategy';

@Module({
    imports: [UserModule],
    providers: [GoogleAuthService, GoogleStrategy],
    exports: [GoogleAuthService, GoogleStrategy],
})
export class AuthModule {}
