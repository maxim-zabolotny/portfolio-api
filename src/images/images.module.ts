import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Images } from './images.entity';
import { ImagesService } from './images.service';
import { ImageUtilsModule } from '../image/image-utils.module';
import { ImageUtilsService } from '../image/image-utils.service';
import { ImagesController } from './images.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Images]), ImageUtilsModule],
  exports: [TypeOrmModule, ImagesService],
  providers: [ImagesService, ImageUtilsService],
  controllers: [ImagesController]
})
export class ImagesModule {}
