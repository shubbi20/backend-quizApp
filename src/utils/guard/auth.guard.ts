import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/db/entities/user.entity';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const token = request.headers.jwt;
      console.log(token);
      if (!token) {
        throw new HttpException('invalid token', 401);
      }
      const decoded = jwt.verify(token, 'secret_key');
      console.log(decoded, 'decod');
      if (!decoded) {
        throw new HttpException('invalid token', 401);
      }
      const email: string = decoded.email;

      const user = await User.findOneBy({ email: email });

      request.authUser = user;

      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
