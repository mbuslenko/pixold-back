import { Global, Module } from '@nestjs/common';
import { UserRepository } from './domains/user/persistance/user.repository';
import { UserService } from './domains/user/services/user.service';

@Global()
@Module({
    providers: [UserRepository],
    exports: [UserRepository],
})
export class GlobalModule {}