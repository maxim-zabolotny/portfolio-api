import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommentsModule } from './comments/comments.module';
import { ImagesModule } from './images/images.module';
import { ImageUtilsModule } from './image/image-utils.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.env.IMG_PATH),
      serveRoot: process.env.SERVE_ROOT,
      exclude: ['/api*'],
    }),
    TypeOrmModule.forRoot(),
    AuthModule,
    UserModule,
    CommentsModule,
    ImagesModule,
    ImageUtilsModule,
    PortfolioModule,
  ],
})
export class AppModule {}
