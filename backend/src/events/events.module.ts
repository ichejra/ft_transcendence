import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { UsersModule } from "src/users/users.module";
import { ConnectionsService } from "./connections.service";
import { EventsGateway } from "./events.gateway";

@Module({
    imports: [
        UsersModule,
        AuthModule
    ],
    controllers: [],
    providers: [
        EventsGateway,
        ConnectionsService
    ]
})
export class EventsModule {}
