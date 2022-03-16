import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('game')
export class Game {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User, (e: User) => e.wonGames, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'winnerId' })
  winner?: User;

  @ManyToOne(() => User, (e: User) => e.lostGames, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'loserId' })
  loser?: User;

  @Column({
    type: 'varchar',
    name: 'score',
    length: 10,
  })
  score?: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  playedAt?: Date;
};

//* create a table in our database
