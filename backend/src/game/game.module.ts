import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { ChannelsModule } from "src/chat/channels/channels.module";
import { ConnectionsService } from "src/events/connections.service";
import { UsersModule } from "src/users/users.module";
import { Game } from "./entities/game.entity";
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
    ConnectionsService
  ], //? Gateways are not instantiated until they are referenced in the providers array of an existing module.
})
export class GameModule {}
