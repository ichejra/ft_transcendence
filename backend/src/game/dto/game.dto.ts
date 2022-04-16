import { IsNumber, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class GameDto {
  @IsNumber()
  id?: number;

  winner: User;

  loser: User;

  @IsNumber()
  winnerScore: number;

  @IsNumber()
  loserScore: number;

  @IsString()
  score?: string;
}
