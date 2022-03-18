import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseGuards
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ChannelsService } from "./channels.service";
import { ChannelDto } from "./dto/channel.dto";
import { UpdateChannelDto } from "./dto/update-channel.dto";
import { Channel } from "./entities/channel.entity";
import { MemberStatus } from "./entities/user-channel.entity";

@Controller('channels')
export class ChannelsController {
    constructor(private channelsService: ChannelsService) {}

    /* Route for creating a channel
        http://${host}:${port}/channels/create
    */
    @Post('create')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    createChannel(@Req() _req: any, @Body() data: ChannelDto) {
        return this.channelsService.createChannel(_req.user, data);
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
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    updateChannel(
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body() data: UpdateChannelDto) : Promise<Channel> {
       return this.channelsService.updateChannel(channelId, data);
   }

    /* Route delete channel */
    @Delete('/:channelId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    deleteChannel(@Param('channelId', ParseIntPipe) channelId: number) : Promise<any> {
        return this.channelsService.deleteChannel( Number(channelId) );
    }

    /* Route add admin -> set a member as admin */
    @Patch('add-new-admin/:channelId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    addNewAdmin(
        @Req() _req: any,
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId') memberId: number): Promise<any> {
        return this.channelsService.addAdmin(channelId, Number(_req.user.id), memberId);
    }

    /* Route remove admin -> change the status user to member */
    @Patch('remove-admin/:channelId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    removeAdmin(
        @Req() _req: any, 
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId') memberId: number): Promise<any> {
        return this.channelsService.addAdmin(channelId, Number(_req.user.id), memberId);
    }
    /* Route mute member ()-> set the user as mutant */
    @Patch('mute-user/:channelId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    muteUser(
        @Req() _req: any,
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('userId') userId: number): Promise<any> {
        return this.channelsService.changeStatus(channelId, Number(_req.user.id), userId, MemberStatus.MUTED);
    }

    @Patch('ban-user/:channelId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    banUser(
        @Req() _req: any,
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('userId') userId: number): Promise<any> {
        return this.channelsService.changeStatus(channelId, Number(_req.user.id), userId, MemberStatus.BANNED);
    }
};