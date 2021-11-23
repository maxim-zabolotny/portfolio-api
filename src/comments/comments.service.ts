import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/user/user.entity';
import { Comment } from './comments.entity';
import { CustomValidation } from 'src/utils/custom-validation';
import { PaginatedCommentsDto } from './dto/paginatedComments.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { getTotalPages } from 'src/utils/get-total-pages';
import { PaginationDto } from '@shared/pagination.dto';
import { Images } from 'src/images/images.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
  ) {
  }

  async getImgComments(
    ImgId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedCommentsDto> {
    const img = await this.imagesRepository.findOne(ImgId);
    new CustomValidation().notFound('Img', 'id', ImgId, img);

    const page = Number(paginationDto.page);
    const limit = Number(paginationDto.limit) || 10;
    const skippedItems = (page - 1) * limit;
    const [data, count]: [
      Comment[],
      number,
    ] = await this.commentRepository
      .createQueryBuilder('comments')
      .leftJoin('comments.author', 'author')
      .addSelect(['author.firstName', 'author.lastName'])
      .orderBy('comments.createdAt', 'DESC')
      .take(limit)
      .skip(skippedItems)
      .getManyAndCount();

    const totalPages = getTotalPages(count, limit, page);

    return { data, count, totalPages };
  }

  async createComment(
    userId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<HttpException> {
    const { text, imgId } = createCommentDto;

    const image = await this.imagesRepository.findOne(imgId);
    new CustomValidation().notFound('Img', 'ID', imgId, image);

    const user = await this.userRepository.findOne(userId);
    new CustomValidation().notFound('User', 'id', userId, user);

    await this.commentRepository.save({
      text,
      image: image,
      author: user,
    });
    return new HttpException('Comments added', 201);
  }
}
