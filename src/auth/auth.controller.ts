import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService)  {}

  @Post('/signUp')
  async signUp(@Res() res, @Body() authData: CreateUserDTO): Promise<HttpStatus> {
    const newUser = await this.authService.signUp(authData);

    if (newUser) {
      return res.status(HttpStatus.OK).json(newUser);
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/signIn')
  async signIn(@Res() res, @Body() authData: CreateUserDTO): Promise<HttpStatus> {
    const newUser = await this.authService.signIn(authData);
    return res.status(HttpStatus.OK).json(newUser);
  }
}
