import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateAccountInputType } from './dto/create-account.dto';
import { Repository } from 'typeorm';
import { LoginInput } from './dto/login.dto';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInputType): Promise<[boolean, string?]> {
    try {
      // check new user
      const exist = await this.user.findOne({ where: { email } });
      if (exist) {
        return [false, 'This email is already created'];
      }

      // create new User
      await this.user.save(this.user.create({ email, password, role }));
      return [true];
    } catch (e) {
      console.log(e);
      return [false, "Couldn't create account"];
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<[boolean, string?, string?]> {
    // find the user with the email
    // check if the password is correct
    // make a JWT and give it to user

    try {
      const user = await this.user.findOne({ where: { email } });
      if (!user) {
        return [false, 'Not Found The User'];
      }

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return [false, 'Not Correct Password'];
      }
      const token = this.jwt.sign({ id: user.id });

      return [true, 'Welcome', token];
    } catch (e) {
      return [false, e];
    }
  }
}
