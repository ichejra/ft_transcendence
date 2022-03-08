import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('game')
export class Game /* extends BaseEntity */ {
  @PrimaryGeneratedColumn()
  _id: number;

  //* add other columns
  // @Column()
  // type: string;

  // @Column()
  // player1: User;

  // @Column()
  // player2: User;

  // @Column()
  // winner: User;

  // @Column()
  // looser: User;

  // @Column()
  // score1: number;

  // @Column()
  // score2: number;
}

//* create a table in our database
