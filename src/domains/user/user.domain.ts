import { Injectable } from '@nestjs/common';
import { AuthDto } from '../../api/auth/dto/auth.dto';
import { UserAuthService } from './services/user-auth.service';
import { UserService } from './services/user.service';

@Injectable()
export class UserDomain {
  constructor(
    private readonly userAuthService: UserAuthService,
    private readonly userService: UserService,
  ) {}

  async authenticate(props: AuthDto, ip: string) {
    return this.userAuthService.authenticateService(props, ip);
  }

  async updateUsername(id: string, username: string) {
    return this.userService.updateUsername(id, username);
  }

  async checkUsername(username: string) {
    return this.userService.checkUsername(username);
  }

  async getUserById(id: string) {
    return this.userService.getUserById(id);
  }
}
