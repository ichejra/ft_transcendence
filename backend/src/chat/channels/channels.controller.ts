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
import { MemberStatus, UserChannel } from "./entities/user-channel.entity";

@Controller('channels')
export class ChannelsController {
    constructor(private channelsService: ChannelsService) {}

    /* Route for creating a channel
        http://${host}:${port}/api/channels/create
    */
    @Post('create')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    createChannel(@Req() _req: any, @Body() data: ChannelDto): Promise<Channel> {
        return this.channelsService.createChannel(_req.user, data);
    }

    /* Route for getting all channels 
        http://${host}:${port}/api/channels
    */
    @Get()
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getChanels(): Promise<Channel[]> {
        return this.channelsService.getChannels();
    }
    
    /* Route get channel 
        http://${host}:${port}/api/channels/{channelId}
    */
    @Get('/:channelId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getChannelById(@Param('channelId', ParseIntPipe) channelId: number): Promise<Channel> {
        console.log('channel id');
        return this.channelsService.getChannelById(Number(channelId));
    }

    /* channel members */
    @Get('/:channelId/members')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getChannelMembers(@Param('channelId', ParseIntPipe) channelId: number): Promise<UserChannel[]> {
        console.log('members');
        return this.channelsService.getChannelsMembers(Number(channelId));
    }

    /* Route update channel
        http://${host}:${port}/api/channels/channelId
    */
    @Patch('/:channelId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    updateChannel(
        @Req() _req: any,
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body() data: UpdateChannelDto): Promise<Channel> {
        return this.channelsService.updateChannel(Number(_req.user.id), channelId, data);
    }

    /* Route delete channel */
    @Delete('/:channelId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    deleteChannel(@Req() req: any, @Param('channelId', ParseIntPipe) channelId: number) : Promise<any> {
        return this.channelsService.deleteChannel(Number(req.user.id), Number(channelId));
    }

    /* Route add admin -> set a member as admin */
    @Patch('/:channelId/add-new-admin')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    addNewAdmin(
        @Req() _req: any,
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId') memberId: number): Promise<any> {
        return this.channelsService.addAdmin(channelId, Number(_req.user.id), memberId);
    }

    /* Route remove admin -> change the status user to member */
    @Patch('/:channelId/remove-admin')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    removeAdmin(
        @Req() _req: any, 
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId') memberId: number): Promise<any> {
        return this.channelsService.removeAdmin(channelId, Number(_req.user.id), memberId);
    }
    /* Route mute member ()-> set the user as mutant */
    @Patch('/:channelId/mute-user')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    muteUser(
        @Req() _req: any,
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId') memberId: number): Promise<any> {
        return this.channelsService.changeStatus(channelId, Number(_req.user.id), memberId, MemberStatus.MUTED);
    }

    @Patch('/:channelId/ban-user')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    banUser(
        @Req() _req: any,
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId') memberId: number): Promise<any> {
        return this.channelsService.changeStatus(channelId, Number(_req.user.id), memberId, MemberStatus.BANNED);
    }

    @Patch('/:channelId/set-update-password')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    setUpdatePwd(
        @Req() _req: any,
        @Param('channelId') channelId: number,
        @Body('password') password: string
    ) : Promise<any> {
        return this.channelsService.setUpdatePassword(Number(_req.user.id), channelId, password);
    }
};