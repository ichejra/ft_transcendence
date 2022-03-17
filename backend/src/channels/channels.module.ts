import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelsController } from "./channels.controller";
import { ChannelsService } from "./channels.service";
import { ChatGatway } from "./chat.gatway";
import { Channel } from "./entities/channel.entity";
import { Message } from "src/channels/entities/message.entity";
import { UsersModule } from "src/users/users.module";
import { MessagesService } from "./messages.service";
import { ConnectionsService } from "../events/connections.service";
import { UserChannel } from "./entities/user-channel.entity";
import { AuthModule } from "src/auth/auth.module";
import { JwtModule } from "@nestjs/jwt";


@Module({
    imports: [ 
        TypeOrmModule.forFeature([ Channel, UserChannel, Message ]),
        UsersModule,
        AuthModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET ,
            signOptions: { expiresIn: process.env.JWT_EXPIRESIN }
        }),
    ],
    controllers: [ ChannelsController ],
    providers: [
        ChannelsService,
        ChatGatway,
        MessagesService,
        ConnectionsService,
    ]
})
export class ChannelsModule {}