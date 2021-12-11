import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from '../../auth/auth.namespace';
import { UserDomain } from '../../domains/user/user.domain';

@Controller('user')
export class UserController {
    constructor(
        private readonly userDomain: UserDomain
    ) { }

    @Post('auth')
    async auth(
        @Body() body: Auth.GoogleRedirectResponse
    ): Promise<any> {
        return this.userDomain.authenticate(body);
    }
}
