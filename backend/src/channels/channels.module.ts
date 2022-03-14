import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelsController } from "./channels.controller";
import { ChannelsService } from "./channels.service";
import { ChatGatway } from "./chat.gatway";
import { Channel } from "./entities/channel.entity";
import { Message } from "src/channels/entities/message.entity";
import { UsersModule } from "src/users/users.module";
import { MessagesService } from "./messages.service";
import { ClientsService } from "./clients.service";
import { UserChannel } from "./entities/user-channel.entity";
import { AuthModule } from "src/auth/auth.module";


@Module({
    imports: [ 
        TypeOrmModule.forFeature([ Channel, UserChannel, Message ]),
        UsersModule,
        AuthModule,
    ],
    controllers: [ ChannelsController ],
    providers: [
        ChannelsService,
        ChatGatway,
        MessagesService,
        ClientsService,
    ]
})
export class ChannelsModule {}