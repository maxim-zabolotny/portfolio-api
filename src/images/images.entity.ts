import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '@shared/base.entity';
import { Portfolio } from '../portfolio/portfolio.entity';
import { Comment } from '../comments/comments.entity';

@Entity({ name: 'images' })
export class Images extends BaseEntity {
  @ApiProperty()
  @Column({nullable: true})
  public name: string;

  @ApiProperty()
  @Column({nullable: true})
  public description: string;

  @ApiProperty()
  @Column()
  public url: string;

  @ApiProperty({ type: () => Portfolio })
  @ManyToOne(() => Portfolio, (portfolio) => portfolio.images, { onDelete: 'CASCADE' })
  public portfolio: Portfolio;

  @ApiProperty({ type: () => Comment })
  @OneToMany(() => Comment, (comment) => comment.image, { onDelete: 'CASCADE' })
  public comments: Comment[];
}
