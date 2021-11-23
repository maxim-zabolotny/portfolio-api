import {
  Controller,
  Delete,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt.guard';
import { UserService } from './user.service';
import { IRequest } from './interfaces/request.interface';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public delete(
    @Request() req: IRequest,
    @Param('id') id: number,
  ): Promise<boolean> {
    return this.userService.removeUser(req.user, id);
  }
}
