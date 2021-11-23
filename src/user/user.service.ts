import { hashSync } from 'bcrypt';
import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { CustomValidation } from 'src/utils/custom-validation';
import { CreateUserDto } from './dto/create-user.dto';
import { Images } from 'src/images/images.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Images)
    private imagesRepository: Repository<Images>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

    async createUser(body: CreateUserDto): Promise<User> {
    body.password = hashSync(body.password, JSON.parse(process.env.SALT));
    body.confirmPassword = hashSync(
      body.confirmPassword,
      JSON.parse(process.env.SALT),
    );
    return this.userRepository.save(body);
  }

  async removeUser(currentUser: User, id: number): Promise<boolean> {

    const theCurrentUser = currentUser.id === id;
    new CustomValidation().noAccess(theCurrentUser);

    const user = await this.userRepository.findOne(id);
    new CustomValidation().notFound('User', 'ID', id, user);

    const res = await this.userRepository.delete(id);
    return !!res
  }
}
