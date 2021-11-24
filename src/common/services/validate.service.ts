import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidateService {
  async validateUsername(username) {
    const USERNAME_REGEXP = /^[A-Z-a-z-0-9_.]+$/;

    if (!USERNAME_REGEXP.test(username)) {
      throw new Error(
        'Имя пользователя должно содержать только латинские буквы или цифры',
      );
    }
  }
}
