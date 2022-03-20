import { Body, Controller, Get, Post, Request, UseGuards} from '@nestjs/common';
import { CreateUserDTO } from 'src/auth/dto/create-user.dto';
import JwtAuthGuard from 'src/auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getUserData(@Request() req) {
    return this.userService.getUserData(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/update')
  updateData(@Request() req, @Body() newData) {
    return this.userService.updateData(req.user, newData)
  }
}
