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
    UseGuards
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ReqUser } from "src/users/decorators/req-user.decorator";
import { User } from "src/users/entities/user.entity";
import { ChannelsService } from "./channels.service";
import { ChannelDto } from "./dto/channel.dto";
import { UpdateChannelDto } from "./dto/update-channel.dto";
import { Channel } from "./entities/channel.entity";
import { MemberStatus, UserChannel } from "./entities/user-channel.entity";
import { RoleAdminGuard } from "./guards/role-admin.guard";
import { RoleOwnerGuard } from "./guards/role-owner.guard";

@Controller('channels')
export class ChannelsController {
    constructor(private channelsService: ChannelsService) { }

    /* Route for creating a channel
        http://${host}:${port}/api/channels/create
    */
    @Post('create')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    createChannel(@ReqUser() user: User, @Body() data: ChannelDto): Promise<Channel> {
        return this.channelsService.createChannel(user, data);
    }

    /* Route for getting all channels 
        http://${host}:${port}/api/channels
    */
    @Get()
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getChannels(): Promise<Channel[]> {
        return this.channelsService.getChannels();
    }
    //
    @Get('joined')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getJoinedChannels(
        @ReqUser() user: User
    ): Promise<Channel[]> {
        return this.channelsService.getJoinedChannels(Number(user.id));
    }

    //
    @Get('unjoined')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getUnjoinedChannels(
        @ReqUser() user: User
    ): Promise<Channel[]> {
        return this.channelsService.getUnjoinedChannels(Number(user.id));
    }

    /* Route get channel 
        http://${host}:${port}/api/channels/{channelId}
    */
    @Get('/:channelId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getChannelById(@Param('channelId', ParseIntPipe) channelId: number): Promise<Channel> {
        return this.channelsService.getChannelById(Number(channelId));
    }

    /* channel members */
    @Get('/:channelId/members')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getChannelMembers(@Param('channelId', ParseIntPipe) channelId: number): Promise<UserChannel[]> {
        return this.channelsService.getChannelsMembers(Number(channelId));
    }

    /* Route update channel
        http://${host}:${port}/api/channels/channelId
    */
    @Patch('/:channelId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @UseGuards(RoleOwnerGuard)
    // Owner role
    updateChannel(
        @ReqUser() user: User,
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body() data: UpdateChannelDto): Promise<Channel> {
        return this.channelsService.updateChannel(Number(user.id), channelId, data);
    }

    /* Route delete channel */
    @Delete('/:channelId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @UseGuards(RoleOwnerGuard)
    // Owner Role
    deleteChannel(
        @ReqUser() user: User,
        @Param('channelId', ParseIntPipe) channelId: number): Promise<any> {
        return this.channelsService.deleteChannel(Number(user.id), Number(channelId));
    }

    /* Route add admin -> set a member as admin */
    @Patch('/:channelId/add-new-admin')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @UseGuards(RoleOwnerGuard)
    // Owner role
    addNewAdmin(
        @ReqUser() user: User,
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId', ParseIntPipe) memberId: number): Promise<any> {
        return this.channelsService.addAdmin(channelId, Number(user.id), memberId);
    }

    /* Route remove admin -> change the status user to member */
    @Patch('/:channelId/remove-admin')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @UseGuards(RoleOwnerGuard)
    // Owner role
    removeAdmin(
        @ReqUser() user: User,
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId', ParseIntPipe) memberId: number): Promise<any> {
        return this.channelsService.removeAdmin(channelId, Number(user.id), memberId);
    }
    /* Route mute member ()-> set the user as mutant */
    @Patch('/:channelId/mute-user')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @UseGuards(RoleAdminGuard)
    // admin role
    muteUser(
        @ReqUser() user: User,
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId', ParseIntPipe) memberId: number): Promise<any> {
        return this.channelsService.changeStatus(channelId, Number(user.id), memberId, MemberStatus.MUTED);
    }

    @Patch('/:channelId/ban-user')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @UseGuards(RoleAdminGuard)
    // admin role
    banUser(
        @ReqUser() user: User,
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId', ParseIntPipe) memberId: number): Promise<any> {
        return this.channelsService.changeStatus(channelId, Number(user.id), memberId, MemberStatus.BANNED);
    }

    @Patch('/:channelId/set-update-password')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @UseGuards(RoleOwnerGuard)
    // Owner role
    setUpdatePwd(
        @ReqUser() user: User,
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('password') password: string
    ): Promise<any> {
        return this.channelsService.setUpdatePassword(Number(user.id), channelId, password);
    }

    @Patch('/:channelId/kick-user')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @UseGuards(RoleAdminGuard)
    // admin role
    kickUser(
        @ReqUser() user: User,
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId', ParseIntPipe) memberId: number): Promise<any> {
        return this.channelsService.kickUser(Number(user.id), memberId, channelId);
    }

    @Patch('/:channelId/unban-user')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    // admin role
    @UseGuards(RoleAdminGuard)
    unbanUser(
        @ReqUser() user: User,
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId', ParseIntPipe) memberId: number) : Promise<any> {
        return this.channelsService.unbanUser(Number(user.id), channelId, memberId);  
    }
    
    @Patch('/:channelId/unmute-user')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    // admin role
    @UseGuards(RoleAdminGuard)
    unmuteUser(
        @ReqUser() user: User,
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId', ParseIntPipe) memberId: number): Promise<any> {
        return this.channelsService.changeStatus(channelId, user.id, memberId, MemberStatus.ACTIVED);
    }
};