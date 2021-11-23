import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthResponse } from './auth';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('register')
  public async register(@Body() dto: CreateUserDto): Promise<AuthResponse> {
    return this.authService.registerUser(dto);
  }

  @Post('login')
  public async login(@Body() dto: AuthDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

}
