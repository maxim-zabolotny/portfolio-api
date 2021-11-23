import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images } from 'src/images/images.entity';
import { ImagesService } from 'src/images/images.service';
import { UsersController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { ImageUtilsModule } from '../image/image-utils.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Images]),
    ImageUtilsModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRES },
    }),
  ],
  exports: [TypeOrmModule, JwtModule],
  controllers: [UsersController],
  providers: [UserService, ImagesService],
})
export class UserModule {}
