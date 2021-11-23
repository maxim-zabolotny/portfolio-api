import {
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';

import { User } from 'src/user/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@shared/base.entity';
import { Images } from '../images/images.entity';

@Entity()
export class Comment extends BaseEntity{

  @ApiProperty()
  @Column('varchar', { length: 500 })
  text: string;

  @ManyToOne(() => User, (user) => user.comments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  author: Partial<User>;

  @ManyToOne(() => Images, (image) => image.comments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  image: Images;
}
