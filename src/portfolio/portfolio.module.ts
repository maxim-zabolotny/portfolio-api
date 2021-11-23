import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PortfolioController } from './portfolio.controller';
import { Portfolio } from './portfolio.entity';
import { PortfolioService } from './portfolio.service';
import { User } from '../user/user.entity';
import { Images } from 'src/images/images.entity';
import { ImagesModule } from 'src/images/images.module';
import { ImagesService } from 'src/images/images.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Portfolio, User, Images]),
    ImagesModule
  ],
  exports: [TypeOrmModule, PortfolioService, ImagesModule],
  controllers: [PortfolioController],
  providers: [PortfolioService, ImagesService],
})
export class PortfolioModule {}
