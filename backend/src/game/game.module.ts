import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";
import { ChannelsModule } from "src/channels/channels.module";
import { ClientsService } from "src/channels/clients.service";
import { UsersModule } from "src/users/users.module";
import { Game } from "./entities/game.entity";
// import { GameController } from "./game.controller";
import { GameGateway } from "./game.gateway";
import { GameService } from "./game.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ Game ]),
    UsersModule,
    ChannelsModule,
    AuthModule
  ],
  controllers: [  ],
  providers: [
    GameService,
    GameGateway,
    ClientsService
  ], //? Gateways are not instantiated until they are referenced in the providers array of an existing module.
})
export class GameModule {}
