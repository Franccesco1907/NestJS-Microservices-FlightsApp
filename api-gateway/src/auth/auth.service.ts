import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from '../user/dto/user.dto';
import { ClientProxySuperFlights } from 'src/common/proxy/client-proxy';
import { UserMSG } from 'src/common/constants';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientProxy: ClientProxySuperFlights,
    private readonly jwtService: JwtService,
  ) { }

  private _clientProxyUser = this.clientProxy.clientProxyUsers();

  async validateUser(username: string, password: string): Promise<any> {
    const user$ = await this._clientProxyUser.send(UserMSG.VALID_USER, { username, password });
    const user = lastValueFrom(user$)

    if (user) return user;

    return null;
  }

  async signIn(user: any) {
    const payload = {
      username: user.username,
      sub: user._id,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async signUp(userDTO: UserDTO) {
    return await this._clientProxyUser.send(UserMSG.CREATE, userDTO);
  }
}
