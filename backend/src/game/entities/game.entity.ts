import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('game')
export class Game {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'winnerId' })
  winner?: User;

  @Column({ default: 0 })
  winnerScore?: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'loserId' })
  loser?: User;

  @Column({ default: 0 })
  loserScore?: number;

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
}
