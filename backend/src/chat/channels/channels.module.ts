import { Module } from "@nestjs/common";
import { ChannelsController } from "./channels.controller";
import { ChannelsService } from "./channels.service";
import { UsersModule } from "src/users/users.module";
import { MessagesService } from "../messages/messages.service";
import { ConnectionsService } from "../../events/connections.service";
import { AuthModule } from "src/auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { MessagesModule } from "../messages/messages.module";

@Module({
    imports: [ 
        UsersModule,
        AuthModule,
        MessagesModule,
    ],
    controllers: [ ChannelsController ],
    providers: [
        ChannelsService,
        MessagesService,
        ConnectionsService,
    ]
})
export class ChannelsModule {}