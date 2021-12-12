import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';

import { Auth } from '../../auth/auth.namespace';
import { PixoldAuthGuard } from '../../common/guards/auth.guard';
import { UserDomain } from '../../domains/user/user.domain';
import { UpdateUsernameDto } from './dto/user.dto';

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

    @UseGuards(PixoldAuthGuard)
    @Post('update/username')
    async updateUsername(
        @Request() req: Request,
        @Body() body: UpdateUsernameDto,
    ) {
        return this.userDomain.updateUsername(req.headers['user'], body.username);
    }
}
