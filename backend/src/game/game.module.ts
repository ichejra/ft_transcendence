import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game } from "./entities/game.entity";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";

@Module({
  imports: [ TypeOrmModule.forFeature([ Game ]) ],
  controllers: [ GameController ],
  providers: [ GameService ],
})
export class GameModule {}