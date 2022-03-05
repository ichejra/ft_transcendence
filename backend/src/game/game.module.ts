import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game } from "./entities/game.entity";
import { GameController } from "./game.controller";
import { GameGateway } from "./game.gateway";
import { GameService } from "./game.service";

@Module({
  imports: [ TypeOrmModule.forFeature([ Game ]) ],
  controllers: [ GameController ],
  providers: [ GameService, GameGateway ], //? Gateways are not instantiated until they are referenced in the providers array of an existing module.
})
export class GameModule {}