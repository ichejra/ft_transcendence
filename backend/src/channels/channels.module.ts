import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelsController } from "./channels.controller";
import { Channel } from "./entities/channel.entity";


@Module({
    imports: [ 
        TypeOrmModule.forFeature([ Channel ]),
    ],
    controllers: [ ChannelsController ],
    providers: []
})
export class ChannelsModule { }