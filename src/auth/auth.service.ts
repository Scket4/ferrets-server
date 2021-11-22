import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/interfaces/user.interface';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class AuthService {

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async signUp(authData: CreateUserDTO): Promise<CreateUserDTO> {
    const newUser = await this.userModel.create(authData);
    return newUser.save();
  }

  async signIn(authData: CreateUserDTO): Promise<CreateUserDTO> {
    const newUser = await this.userModel.create(authData);
    return newUser.save();
  }
}
