import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';

import { Comment } from 'src/comments/comments.entity';
import { User } from 'src/user/user.entity';
import { Images } from 'src/images/images.entity';
import { Portfolio } from '../portfolio/portfolio.entity';

export class CustomValidation {
  notFound(
    entityName: string,
    fieldName: string,
    fieldValue: string | number,
    searchResult:
      | Comment
      | Images
      | Portfolio
      | User,
    deleteResult?: DeleteResult,
  ): HttpException | void {
    if (
      (!searchResult && !deleteResult) ||
      (!searchResult && !deleteResult.affected)
    ) {
      throw new NotFoundException(
        `${entityName} with ${fieldName}: ${fieldValue} not found`,
      );
    }
  }

  isExists(
    entityName: string,
    fieldName: string,
    fieldValue: string,
    searchResult: User,
  ): HttpException | void {
    if (searchResult) {
      throw new BadRequestException(
        `${entityName} with ${fieldName}: ${fieldValue} already exist`,
      );
    }
  }

  noAccess(currentUserId: boolean): HttpException | void {
    if (!currentUserId) {
      throw new ForbiddenException();
    }
  }

  passwordMismatch(
    password: string,
    confirmedPassword: string,
  ): HttpException | void {
    if (password !== confirmedPassword) {
      throw new BadRequestException(`Password mismatch`);
    }
  }
}
