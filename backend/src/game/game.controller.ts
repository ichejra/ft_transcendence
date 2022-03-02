import { Body, Controller, HttpCode, Param, Post } from "@nestjs/common";
import { GameDto } from "./dto/game.dto";
import { Game } from "./entities/game.entity";
import { GameService } from "./game.service";


@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}
  /* Route for creating a new game
   http://${host}:${port}/game/create-game
  */
  @Post('create-game')
  @HttpCode(200)
  createNewGame(@Body() data: GameDto) : Promise<Game> {
    return this.gameService.insertGameData(data);
  }

}