import { IsNumber, IsString } from 'class-validator';
import { UserChannel } from 'src/chat/channels/entities/user-channel.entity';
import { User } from 'src/users/entities/user.entity';

export class GameDto {
  @IsNumber()
  id?: number;

  // @IsNumber()
  winner: User;

  // @IsNumber()
  loser: User;

  @IsNumber()
  winnerScore: number;

  @IsNumber()
  loserScore: number;

  @IsString()
  score?: string;
}
