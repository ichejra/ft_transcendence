import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "src/auth/auth.module";
import { ConnectionsService } from "src/events/connections.service";
import { UsersModule } from "src/users/users.module";
import { MessagesModule } from "../messages/messages.module";
import { MessagesService } from "../messages/messages.service";
import { DirectChatService } from "./direct-chat.service";

Module({
    imports: [
        UsersModule,
        AuthModule,
        MessagesModule,
    ],
    controllers: [],
    providers: [ 
        MessagesService,
        ConnectionsService,
        DirectChatService
    ]
})
export class DirectChatModule {}