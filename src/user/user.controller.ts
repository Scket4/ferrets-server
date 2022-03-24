import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateUserDTO } from 'src/auth/dto/create-user.dto';
import JwtAuthGuard from 'src/auth/jwt-auth.guard';
import { User } from './interfaces/user.interface';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(
    private userService: UserService,
    private config: ConfigService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/profile/:username')
  getUserData(@Param('username') username: string) {
    return this.userService.getUserData(username);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/',
        filename: (req, file, cb) => {
          const nameSplit = file.originalname.split('.');
          const fileExt = nameSplit[nameSplit.length - 1];
          cb(null, `${Date.now()}.${fileExt}`);
        },
      }),
    }),
  )
  @Post('/update')
  updateData(
    @Request() req,
    @Body() updatedData,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let filePath: string;
    const SERVER_URL = this.config.get<string>('base_url');
    
    if (file?.path) {
      filePath = `${SERVER_URL}${file.path}`;
    }

    return this.userService.updateData(req.user, updatedData, filePath);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/my-profile')
  getMyProfile(@Request() req) {
    return this.userService.getMyUserData(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/search/:query')
  searchUsers(@Param('query') query: string) {
    return this.userService.searchUsers(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/like')
  toggleLike(@Request() req, @Body() targetUser: any) {
    return this.userService.toggleLike(req.user, targetUser.targetUsername);
  }
}
