import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from 'src/auth/dto/create-user.dto';
// const ObjectID = require('mongodb').ObjectID;

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findUser(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username });
  }

  async createUser(user: CreateUserDTO): Promise<User> {
    const findedUser = await this.userModel.findOne({
      username: user.username,
    });

    if (findedUser) {
      throw new ConflictException('Такой пользователь уже существует');
    }

    const password = await UserService.hashPassword(user.password);

    return await this.userModel.create({ ...user, password });
  }

  private static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async getUserData(user: User) {
    const searchUser = await this.findUser(user.username);

    if (!searchUser)
      throw new InternalServerErrorException('Ошибка, данные не найдены');

    return searchUser;
  }

  async updateData(user: User, newData: User) {
    // Надо сделать поиск по id
    return await this.userModel.updateOne(
      { username: user.username },
      {
        $set: {
          ...newData,
        },
      },
      {
        strict: false,
      },
    );
  }

  public static async comparePassword(
    requestPassword: string,
    hashPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(requestPassword, hashPassword);
  }
}
