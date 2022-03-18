import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelsController } from "./channels.controller";
import { ChannelsService } from "./channels.service";
import { ChatGatway } from "../chat.gatway";
import { Channel } from "./entities/channel.entity";
import { UsersModule } from "src/users/users.module";
import { MessagesService } from "../messages/messages.service";
import { ConnectionsService } from "../../events/connections.service";
import { UserChannel } from "./entities/user-channel.entity";
import { AuthModule } from "src/auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { MessagesModule } from "../messages/messages.module";
import { DirectMessage } from "../messages/entities/direct-messages.entity";
import { MessageChannel } from "../messages/entities/message-channel.entity";


@Module({
    imports: [ 
        UsersModule,
        AuthModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET ,
            signOptions: { expiresIn: process.env.JWT_EXPIRESIN }
        }),
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