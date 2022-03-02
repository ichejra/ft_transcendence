import { IsNumber } from "class-validator";

export class GameDto {
  @IsNumber()
  id: number;
}