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

  // пароль убрать
  async getUserData(username: string) {
    const searchUser = await this.findUser(username);

    if (!searchUser)
      throw new InternalServerErrorException('Ошибка, данные не найдены');

    return searchUser;
  }

  // пароль
  async getMyUserData(user: User) {
    const searchUser = await this.findUser(user.username);

    if (!searchUser)
      throw new InternalServerErrorException('Ошибка, данные не найдены');

    return searchUser;
  }

  // убрать пароль
  async updateData(user: User, newData: User, filePath: string = null) {
    let updatedData = { ...newData };

    if (filePath) {
      updatedData = {
        ...updatedData,
        profile_photo: filePath,
      };
    }

    // Надо сделать поиск по id
    return await this.userModel.updateOne(
      { username: user.username },
      {
        $set: {
          ...updatedData,
        },
      },
      {
        strict: false,
      },
    );
  }

  // убрать пароль
  async toggleLike(myUsername: User, likedUser: string) {
    
    const targetUser = await this.userModel.findOne({
      username: likedUser,
    });
    
    const targetUserLikes = await targetUser.get('profile_likes');
    const isLiked = await targetUserLikes.includes(myUsername);

    if (isLiked) {
      
      return await this.userModel.findOneAndUpdate(
        { username: likedUser },
        { $pull: { profile_likes: myUsername } },
        { new: true },
      );
    }

    return await this.userModel.findOneAndUpdate(
      {
        username: likedUser,
      },
      {
        $push: {
          profile_likes: myUsername,
        },
      },
      { new: true },
    );
  }

  // тут убрать пароли и все остальное, оставить username
  async searchUsers(searchQuery: string) {
    return await this.userModel.find({
      username: { $regex: new RegExp('^' + searchQuery) },
    });
  }

  public static async comparePassword(
    requestPassword: string,
    hashPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(requestPassword, hashPassword);
  }
}
