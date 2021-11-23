import {
  BadRequestException, HttpException,
  Injectable, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { Portfolio } from './portfolio.entity';
import { CustomValidation } from '../utils/custom-validation';
import { User } from 'src/user/user.entity';
import { IFile } from 'src/interfaces/file.interface';
import { AddImgPortfolioDto } from './dto/add-img-portfolio.dto';
import { Images } from '../images/images.entity';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Images)
    private imgRepository: Repository<Images>,
  ) {
  }

  async getAll(userId: number): Promise<Portfolio[]> {
    const portfolios = await this.portfolioRepository
      .createQueryBuilder('portfolio')
      .leftJoin('portfolio.user', 'user')
      .addSelect(['user.id'])
      .leftJoinAndSelect('portfolio.images', 'images')
      .where('user.id = :id', { id: userId })
      .getMany();

    return portfolios
  }

  async getPortfolioByName(userId: number, portfolioName: string): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository
      .createQueryBuilder('portfolio')
      .leftJoin('portfolio.user', 'user')
      .addSelect(['user.id'])
      .leftJoinAndSelect('portfolio.images', 'images')
      .where('portfolio.name = :name', { name: portfolioName })
      .getOne();

    new CustomValidation().noAccess(userId === portfolio.user.id)
    new CustomValidation().notFound('Portfolio', 'name', portfolioName ,portfolio)
    return portfolio
  }

  async createPortfolio(
    userId: number,
    createPortfolioDto: CreatePortfolioDto,
  ): Promise<HttpException> {
    const { name } = createPortfolioDto;

    const portfolio = await this.portfolioRepository.findOne({ where: { name } });
    if (portfolio) throw new BadRequestException(`Portfolio with name: ${name} already exist`);

    const user = await this.userRepository.findOne(userId);
    new CustomValidation().notFound('Користувач', 'ID', userId, user);

    await this.portfolioRepository.save({
      ...createPortfolioDto,
      user,
      images: null,
    });
    return new HttpException('Porfolio added', 201);
  }

  async addImg(body: AddImgPortfolioDto, image: IFile, userId: number) {
    const { portfolioId, description, name } = body;

    const portfolio = await this.portfolioRepository
      .createQueryBuilder('portfolio')
      .where({
        id: portfolioId,
      })
      .leftJoin('portfolio.user', 'user')
      .addSelect(['user.id'])
      .getOne();

    if (!portfolio) throw new NotFoundException(`portfolio with id: ${portfolioId} not found`);

    const isCurrentUser = userId === portfolio.user.id;
    new CustomValidation().noAccess(isCurrentUser);

    await this.imgRepository.save({
      name,
      url: image.path,
      description,
      portfolio,
    });

    return new HttpException('img added', 201);
  }

  async deletePortfolio(userId: number, portfolioId: number): Promise<boolean> {

    const portfolio = await this.portfolioRepository
      .createQueryBuilder('portfolio')
      .where({
        id: portfolioId,
      })
      .leftJoin('portfolio.user', 'user')
      .addSelect(['user.id'])
      .getOne();

    if (!portfolio) throw new NotFoundException(`portfolio with id: ${portfolioId} not found`);

    const isCurrentUser = userId === portfolio.user.id;
    new CustomValidation().noAccess(isCurrentUser);

    const res = await this.portfolioRepository.delete(portfolioId);
    return !!res;
  }

  async deleteImgInPortfolio(userId: number, imgId: number): Promise<boolean> {

    const img = await this.imgRepository
      .createQueryBuilder('img')
      .where({id: imgId})
      .leftJoinAndSelect('img.portfolio', 'portfolio')
      .leftJoin('portfolio.user', 'user')
      .addSelect(['user.id'])
      .getOne();

    if (!img) throw new NotFoundException(`img with id: ${imgId} not found`);

    const isCurrentUser = userId === img.portfolio.user.id;
    new CustomValidation().noAccess(isCurrentUser);

    const res = await this.imgRepository.delete(imgId);
    return !!res;
  }
}
