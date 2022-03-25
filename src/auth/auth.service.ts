import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
import { User } from 'src/user/interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from './dto/create-user.dto';
// import { signInDTO } from './dto/sing-in.dto';
import { generateSecretCode } from 'src/utils/generateSecretCode';
import { ValidateService } from 'src/common/services/validate.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    // @InjectModel('User')
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly validate: ValidateService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | any> {
    const user = await this.userService.findUser(username);

    if (!user) {
      throw new UnauthorizedException('Такого пользователя не существует');
    }

    const comparePassword = await UserService.comparePassword(
      password,
      user.password,
    );

    if (!comparePassword) {
      throw new UnauthorizedException('Неправильный логин или пароль');
    }

    return user;
  }

  async register(user: CreateUserDTO) {
    const payload = { username: user.username };

    await this.validate.validateUsername(user.username);

    const newUser = await this.userService.createUser({
      ...user,
      username: user.username.toLowerCase().trim(),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: newUser,
    };
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    if (!access_token) return;

    const signedUser = await this.userService.findUser(user.username);

    return {
      user: signedUser,
      access_token,
    };
  }
}
