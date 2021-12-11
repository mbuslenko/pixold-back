import { Injectable } from "@nestjs/common";
import { Auth } from '../../auth/auth.namespace';
import { UserAuthService } from './services/user-auth.service';

@Injectable()
export class UserDomain {
    constructor(
        private readonly userAuthService: UserAuthService,
    ) {}

    async authenticate(props: Auth.GoogleRedirectResponse) {
        return this.userAuthService.authenticateService(props);
    }
}
