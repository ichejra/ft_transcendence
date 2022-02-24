import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelsController } from "./channels.controller";
import { ChannelEntity } from "./entities/channel.entity";


@Module({
    imports: [ 
        TypeOrmModule.forFeature([ ChannelEntity ]),
    ],
    controllers: [ ChannelsController ],
    providers: []
})
export class ChannelsModule { }