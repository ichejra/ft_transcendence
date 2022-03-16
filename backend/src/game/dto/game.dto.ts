import { IsNumber, IsString } from "class-validator";
import { UserChannel } from "src/channels/entities/user-channel.entity";
import { User } from "src/users/entities/user.entity";

export class GameDto {
  @IsNumber()
  id?: number;

  @IsNumber()
  winnerId: number;

  @IsNumber()
  loserId: number;

  @IsString()
  score?: string
}