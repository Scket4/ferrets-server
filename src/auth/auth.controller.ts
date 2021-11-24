import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { User } from 'src/user/interfaces/user.interface';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  async signUp(@Body() user: CreateUserDTO) {
    return this.authService.register(user);
  }

  @Post('/signIn')
  @UseGuards(LocalAuthGuard)
  async signIn(
    @Body() authData: User,
  ): Promise<any> {
    return this.authService.login(authData);
  }
}
