import { Injectable } from '@nestjs/common';
import { Auth } from '../../auth/auth.namespace';
import { UserAuthService } from './services/user-auth.service';
import { UserService } from './services/user.service';

@Injectable()
export class UserDomain {
  constructor(
    private readonly userAuthService: UserAuthService,
    private readonly userService: UserService,
  ) {}

  async authenticate(props: Auth.GoogleRedirectResponse) {
    return this.userAuthService.authenticateService(props);
  }

  async updateUsername(id: string, username: string) {
    return this.userService.updateUsername(id, username);
  }
}
