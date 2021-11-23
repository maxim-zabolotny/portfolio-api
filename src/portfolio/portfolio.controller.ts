import {
  Body,
  Controller, Delete,
  Get,
  HttpException, Param, ParseIntPipe,
  Post,
  Request, UploadedFile, UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { IFile } from '../interfaces/file.interface';
import { ImageUtilsService } from '../image/image-utils.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { Portfolio } from './portfolio.entity';
import { PortfolioService } from './portfolio.service';
import { IRequest } from 'src/user/interfaces/request.interface';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AddImgPortfolioDto } from './dto/add-img-portfolio.dto';

@ApiTags('Portfolio')
@Controller('portfolios')
export class PortfolioController {
  constructor(
    private portfolioService: PortfolioService,
  ) {
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: 'Get all user portfolios'})
  async getAllPortfolios(
    @Request() req: IRequest,
  ): Promise<Portfolio[]> {
    return this.portfolioService.getAll(req.user.id);
  }

  @Get('/:name')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: 'Get all user portfolio by name'})
  async getPortfolioByName(
    @Request() req: IRequest,
    @Param('name') name: string,
  ): Promise<Portfolio> {
    return this.portfolioService.getPortfolioByName(req.user.id, name);
  }

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiOperation({summary: 'Create user portfolio'})
  async createPortfolio(
    @Body() dto: CreatePortfolioDto,
    @Request() req: IRequest,
  ): Promise<HttpException> {
    return this.portfolioService.createPortfolio(req.user.id, dto);
  }

  @Post('add-img')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: 'Add img for user portfolio'})
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: process.env.IMG_PATH,
        filename: ImageUtilsService.customImageFileName,
      }),
      fileFilter: ImageUtilsService.imageFileFilter,
    }),
  )
  async addImg(
    @Body() addImgPortfolioDto: AddImgPortfolioDto,
    @Request() req: IRequest,
    @UploadedFile() image: IFile,
  ): Promise<HttpException> {
    return await this.portfolioService.addImg(addImgPortfolioDto, image, req.user.id);
  }

  @Delete('/:portfolioId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove user portfolio by id' })
  async deletePortfolio(
    @Request() req: IRequest,
    @Param('portfolioId', ParseIntPipe) portfolioId: number,
  ): Promise<boolean> {
    return this.portfolioService.deletePortfolio(req.user.id, portfolioId);
  }

  @Delete('/img/:imgId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove img in user portfolio' })
  async deleteImgInPortfolio(
    @Request() req: IRequest,
    @Param('imgId', ParseIntPipe) imgId: number,
  ): Promise<boolean> {
    return this.portfolioService.deleteImgInPortfolio(req.user.id, imgId);
  }
}
