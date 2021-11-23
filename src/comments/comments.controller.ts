import {
  Body,
  Controller,
  Get, HttpException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CommentService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Req } from 'src/interfaces/comment.interface';
import { PaginatedCommentsDto } from './dto/paginatedComments.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationDto } from '@shared/pagination.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add comment for img' })
  async createComment(
    @Request() req: Req,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<HttpException> {
    return this.commentService.createComment(req.user.id, createCommentDto);
  }

  @Get('img/:imgId')
  @ApiOperation({ summary: 'Get all comments for img' })
  async getImgComments(
    @Param('imgId', ParseIntPipe) imgId: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedCommentsDto> {
    return this.commentService.getImgComments(imgId, paginationDto);
  }

}
