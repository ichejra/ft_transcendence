import { Controller, Param, Post } from "@nestjs/common";


@Controller('game')
export class GameController {
  // gane creating
  @Post(':id')
  createGame(@Param('id') gameId: number| string){
    return {}
  }
}