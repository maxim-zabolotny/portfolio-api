import {
  Controller,
  Get,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ImagesService } from './images.service';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(
    private imagesService: ImagesService,
  ) {
  }

  @Get('/feed')
  @ApiOperation({summary: 'See image feed '})
  async getFeedImg(
  ): Promise<any> {
    return this.imagesService.getFeedImg();
  }
}
