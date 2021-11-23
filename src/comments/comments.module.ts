import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images } from 'src/images/images.entity';
import { User } from 'src/user/user.entity';

import { CommentController } from './comments.controller';
import { Comment } from './comments.entity';
import { CommentService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Comment, Images])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentsModule {}
