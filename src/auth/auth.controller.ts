import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
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

  @UseGuards(LocalAuthGuard)
  @Post('/signIn')
  async signIn(@Request() req): Promise<any> {        
    return this.authService.login(req.user);
  }
}
