import { Controller } from '@nestjs/common';
import { UserDomain } from '../../domains/user/user.domain';

@Controller('users')
export class UserController {
    constructor(
        private userDomain: UserDomain,
    ) {}
}
