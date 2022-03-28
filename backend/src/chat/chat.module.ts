import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { ConnectionsService } from "src/events/connections.service";
import { UsersModule } from "src/users/users.module";
import { ChannelsModule } from "./channels/channels.module";
import { ChannelsService } from "./channels/channels.service";
import { ChatGatway } from "./chat.gatway";
import { DirectChatModule } from "./direct-chat/direct-chat.module";
import { MessagesService } from "./messages/messages.service";
import { MessagesModule } from './messages/messages.module';
import { DirectChatService } from "./direct-chat/direct-chat.service";

@Module({
    imports: [
        ChannelsModule,
        DirectChatModule,
        MessagesModule,
        UsersModule,
        AuthModule
    ],
    controllers: [],
    providers: [
        ChatGatway,
        ChannelsService,
        MessagesService,
        ConnectionsService,
        DirectChatService
    ]
})
export class ChatModule { }