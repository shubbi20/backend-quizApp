import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import {
  loginValidation,
  signupValidation,
} from 'src/utils/validation/user.schema';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/signup')
  async userSignUp(
    @Body()
    {
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    },
  ) {
    const valid = signupValidation({ email, password, name });
    return this.userService.signUpUser({
      email: valid.email.trim().toLowerCase(),
      password: valid.password,
      name: valid.name,
    });
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() { email, password }: { email: string; password: string },
  ) {
    const valid = loginValidation({ email, password });

    return this.userService.loginUser(
      valid.email.trim().toLowerCase(),
      valid.password.trim(),
    );
  }
}
