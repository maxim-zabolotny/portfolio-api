import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Images } from './images.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Images)
    private imagesRepository: Repository<Images>,
  ) {
  }

  async getFeedImg() {

    const res = await this.imagesRepository
      .createQueryBuilder('image')
      .orderBy('image.createdAt', 'ASC')
      .select([
        'image.description',
        'image.url',
      ])
      .leftJoin('image.portfolio', 'portfolio')
      .addSelect(['portfolio.name'])

      .getMany();

    return res;
  }

}
