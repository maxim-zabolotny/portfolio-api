import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { Repository } from 'typeorm';

import { AuthDto } from './auth.dto';
import { AuthResponse } from './auth';
import { IUserValidationStrategy } from '@shared/strategires/strategy';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { CustomValidation } from 'src/utils/custom-validation';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
  }

  public async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne(email);

    if (!user) {
      throw new HttpException(
        'Такого користувача не існує',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const areEqual = await compare(String(password), user.password);

    if (!areEqual) {
      throw new HttpException('Паролі не співпадають', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  public async login(
    body: AuthDto,
  ): Promise<AuthResponse> {
    const { email } = body;
    const user = await this.userRepository.findOne(
      { email },
    );
    new CustomValidation().notFound('user', 'email', email, user);

    const areEqual = await compare(String(body.password), user.password);

    if (!areEqual) {
      throw new UnauthorizedException('Incorrect password');
    }
    console.log(user);
    const token = this.jwtService.sign({ ...user });
    await this.userRepository.save(user);

    delete user.password

    return { user, token };
  }

  public async registerUser(body: CreateUserDto): Promise<AuthResponse> {
    const { email, confirmPassword, password } = body;

    new CustomValidation().passwordMismatch(confirmPassword, password);


    const isExistsUser = await this.userRepository.findOne({
      where: [{ email: email }],
    });

    new CustomValidation().isExists('user', 'email', email, isExistsUser);

    const user = await this.userService.createUser(body);

    return await this.accessToken(user);
  }

  private async accessToken(user): Promise<AuthResponse> {
    const accessToken = this.jwtService.sign(
      { ...user },
      {
        secret: process.env.SECRET_KEY,
        expiresIn: '2h',
      },
    );
    return { user, token: accessToken };
  }

}
