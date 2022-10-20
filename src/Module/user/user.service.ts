import { HttpException, Injectable } from '@nestjs/common';
import * as Bcrypt from 'bcryptjs';
import { User } from 'src/db/entities/user.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  async signUpUser({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) {
    const user1 = await User.findOneBy({ email: email });
    if (user1) {
      throw new HttpException(
        `User with this email: ${email} is already registered`,
        409,
      );
    }

    const user = new User();
    user.email = email;
    user.password = Bcrypt.hashSync(password, 10);
    user.name = name;
    await user.save();

    const token = jwt.sign(
      {
        email: user.email,
      },
      'secret_key',
      { expiresIn: '3h' },
    );

    return {
      msg: 'successful',
      name: user.name,
      email: user.email,
      token: token,
    };
  }

  async loginUser(email: string, password: string) {
    const user = await User.findOneBy({
      email: email,
    });

    if (!user) {
      throw new HttpException(`User with this id:${email} is not found`, 404);
    }

    const isValidPassword = await Bcrypt.compare(
      password.trim(),
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException('invalid credential', 401);
    }

    const token = jwt.sign(
      {
        email: user.email.toLowerCase().trim(),
      },
      'secret_key',
      { expiresIn: '24h' },
    );

    return {
      msg: 'successful',
      name: user.name,
      email: user.email,
      token: token,
    };
  }

  async deleteUser(id: number) {
    // const apart = await Apartment.createQueryBuilder('apart')
    //   .where('apart.id=:id', { id: id })
    //   .leftJoinAndSelect('apart.createdBy', 'createdBy')
    //   .getOne();

    // if (!apart) {
    //   throw new HttpException(`apartment with this id:${id} is not found`, 404);
    // }

    // const result = this.checkManagerApartment({
    //   role,
    //   id: apart.createdBy.id,
    //   userId,
    // });
    // if (!result) {
    //   throw new HttpException(
    //     'manager can only delete his own apartments',
    //     403,
    //   );
    // }

    const user = await User.delete(id);

    return {
      msg: 'Successfully',
      Data: user,
    };
  }
}
