import {
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from '@shared/base.entity';
import { Comment } from 'src/comments/comments.entity';
import { Portfolio } from '../portfolio/portfolio.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({
    nullable: true,
  })
  public firstName: string;

  @Column({
    nullable: true,
  })
  public lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  public password: string;

  @ApiProperty({ type: () => Comment })
  @OneToMany(() => Comment, (comments) => comments.author)
  public comments: Comment[];

  @ApiProperty({ type: () => Portfolio })
  @OneToMany(() => Portfolio, (portfolio) => portfolio.user)
  public portfolio: Portfolio[];
}
