import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from 'src/shared/base.entity';
import { Images } from '../images/images.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'portfolio' })
export class Portfolio extends BaseEntity {
  @ApiProperty()
  @Column({unique: true})
  public name: string;

  @ApiProperty()
  @Column()
  public description: string;

  @ApiProperty({ type: () => Images })
  @OneToMany(() => Images, (image) => image.portfolio)
  public images: Images[];

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.portfolio)
  public user: User;
}
