// import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
// import { GameDto } from './dto/game.dto';
// import { Game } from './entities/game.entity';
// import { GameService } from './game.service';
// import { GameInterface } from './interfaces/game.interface';

// @Controller('game')
// export class GameController {
//   constructor(private gameService: GameService) {}
//   /* Route for creating a new game
//    http://${host}:${port}/game/create-game
//   */
//   @Get()
//   findAll(): GameInterface[] {
//     // return `All Items`;
//     // return this.gameService.findAll();
//   }
//   @Get(':id')
//   findOne(@Param('id') id: string): GameInterface {
//     return this.gameService.findOne(id);
//     // return `Item ${id}`;
//   }
//   @Post('create-game')
//   @HttpCode(200)
//   createNewGame(@Body() data: GameDto): Promise<Game> {
//     //* return the game obj in game.service
//     // return this.gameService.create(data);
//     // return this.gameService.insertGameData(data);
//   }
//   @Delete(':id')
//   delete(@Param('id') id: string ): Promise<Game> {
//     return this.gameService.delete(id);
//     //* call delete from gameService
//     // return `delete ${id}`;
//   }

//   @Put(':id')
//   update(@Param('id') id : string/* , @Body() updateGameDto: GameDto */): Promise<Game> {
//     //* call update in gamService
//     // return this.gameService.update(id, updateGameDto); // updateGameDto is the new data we wish to assign to a game  
//     // return `update ${id}`;
//     // return `update ${id} - Name: ${updateGameDto.name}`;
//   }
// }
