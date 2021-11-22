import { Controller} from '@nestjs/common';
import { CreateUserDTO } from 'src/auth/dto/create-user.dto';

@Controller('/user')
export class UserController {
  constructor() {}
}
