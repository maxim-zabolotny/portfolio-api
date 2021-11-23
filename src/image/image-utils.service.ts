import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { extname } from 'path';
import * as uuid from 'uuid';

import { IFile } from '../interfaces/file.interface';

@Injectable()
export class ImageUtilsService {
  public static imageFileFilter(
    req: Request,
    file: IFile,
    callback: CallableFunction,
  ): void {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      callback(
        new BadRequestException(
          'Available format only .jpg, .jpeg, .png, .gif',
        ),
        false,
      );
    }

    callback(null, true);
  }

  public static customImageFileName(
    req: Request,
    file: IFile,
    callback: CallableFunction,
  ): void {
    const fileExt = extname(file.originalname);
    const fileName = file.originalname.split('.')[0];

    callback(null, `${fileName}-${uuid.v1()}${fileExt}`);
  }
}
