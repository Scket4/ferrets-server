import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UserGateway } from './user.gateway';


@Module({
  providers: [UserService, UserGateway],
  controllers: [UserController],
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    
  ],
  exports: [UserService],
})
export class UserModule {}
