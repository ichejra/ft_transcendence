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
import { AuthService } from "src/auth/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { UserConnections } from "./models/user-connections.model";


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
        ClientsService,
        UserConnections
    ]
})
export class ChannelsModule {}