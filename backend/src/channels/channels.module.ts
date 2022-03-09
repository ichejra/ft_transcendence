import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelsController } from "./channels.controller";
import { ChannelsService } from "./channels.service";
import { ChatGatway } from "./chat.gatway";
import { Channel } from "./entities/channel.entity";


@Module({
    imports: [ 
        TypeOrmModule.forFeature([ Channel ]),
    ],
    controllers: [ ChannelsController ],
    providers: [ ChannelsService, ChatGatway ]
})
export class ChannelsModule { }