import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './persistance/user.repository';
import { UserAuthService } from './services/user-auth.service';
import { UserDomain } from './user.domain';

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository])],
    exports: [UserDomain],
    providers: [UserDomain, UserAuthService],
})
export class UserModule {}