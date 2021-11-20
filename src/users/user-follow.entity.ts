import {
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from 'typeorm';
import { User } from './user.entity';

@Entity('user_followings')
@Unique('followings', ['follow', 'following'])
export class UserFollowing extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({ name: 'follow_id' })
  @ManyToOne(() => User)
  follow: User;

  @JoinColumn({ name: 'following_id' })
  @ManyToOne(() => User)
  following: User;
}
