import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { ChannelsModule } from "src/chat/channels/channels.module";
import { ConnectionsService } from "src/events/connections.service";
import { UsersModule } from "src/users/users.module";
import { Game } from "./entities/game.entity";
import { GameController } from "./game.controller";
import { GameGateway } from "./game.gateway";
import { GameService } from "./game.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    UsersModule,
    ChannelsModule,
    AuthModule
  ],
  controllers: [GameController],
  providers: [
    GameService,
    GameGateway,
    ConnectionsService
  ],
})
export class GameModule { }
