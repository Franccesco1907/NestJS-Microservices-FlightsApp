import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { UserDTO } from '../user/dto/user.dto';
import { UseGuards } from '@nestjs/common/decorators';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentication')
@Controller('api/v2/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Req() req) {
    return await this.authService.signIn(req.user);
  }

  @Post('signup')
  async signUp(@Body() userDTO: UserDTO) {
    return await this.authService.signUp(userDTO);
  }
}
