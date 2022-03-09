import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ChannelsService } from "./channels.service";
import { ChannelDto } from "./dto/channel.dto";
import { UpdateChannelDto } from "./dto/update-channel.dto";
import { Channel } from "./entities/channel.entity";

@Controller('channels')
export class ChannelsController {
    constructor(private channelsService: ChannelsService) {}

    /* Route for creating a channel
        http://${host}:${port}/channels/create
    */
    @Post('create')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    createChannel(@Body() data: ChannelDto) {
        return this.channelsService.createChannel(data);
    }

    /* Route get channel 
        http://${host}:${port}/channels/{channelId}
    */
    @Get('/:channelId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getChennelById(@Param('channelId', ParseIntPipe) channelId: number): Promise<Channel> {
        return this.channelsService.getChannelById(Number(channelId));
    }

    /* Route update channel
        http://${host}:${port}/channels/channelId
    */
   @Patch('/:channelId')
   @UseGuards(JwtAuthGuard)
   @HttpCode(200)
   updateChannel(@Param('channelId', ParseIntPipe) channelId: number,
                @Body() data: UpdateChannelDto) : Promise<Channel> {
       return this.channelsService.updateChannel(channelId, data);
   }

    /* Route delete channel */
    @Delete('/:channelId')
    @HttpCode(200)
    deleteChannel(@Param('channelId', ParseIntPipe) channelId: number) : Promise<any> {
        return this.channelsService.deleteChannel( Number(channelId) );
    }

    /* Route */

    /*
        Route joining channel -> user_channel table updating
        Route leave channel -> (if Owner then destroy channel) delete relation or banned the user
        Route add admin -> set a member as admin
        Route remove admin -> change the status user to member
        Route mute member ()-> set the user as mutant
    */
};