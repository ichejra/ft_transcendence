import { Body, Controller, Post, Req } from "@nestjs/common";
import { ChannelsService } from "./channels.service";

@Controller('channels')
export class ChannelsController {
    constructor(private channelsService: ChannelsService) {}

    @Post('create')
    create(@Body() data) {
        return this.channelsService.createChannel(data);
    }
}