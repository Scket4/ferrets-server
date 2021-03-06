import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/uploads/:filename')
  async serveAvatar(@Param('filename') filename, @Res() res): Promise<any> {
    res.sendFile(filename, { root: 'uploads'});
  }
}
