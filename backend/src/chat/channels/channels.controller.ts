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
import {
    MemberStatus,
    UserChannel,
    UserRole
} from "./entities/user-channel.entity";
import { RoleAdminGuard } from "./guards/role-admin.guard";
import { RoleOwnerGuard } from "./guards/role-owner.guard";

@Controller('channels')
export class ChannelsController {

    constructor(private channelsService: ChannelsService) { }

    //* Route for creating a channel => http://${host}:${port}/api/channels/create
    @Post('create')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    createChannel(@ReqUser() user: User, @Body() data: ChannelDto): Promise<UserChannel> {
        return this.channelsService.createChannel(user, data);
    }

    //* Route for getting the channes that the user join
    @Get('joined')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getJoinedChannels(
        @ReqUser() user: User
    ): Promise<Channel[]> {
        return this.channelsService.getJoinedChannels(Number(user.id));
    }

    //* Route for getting the channes that the user does not join yet
    @Get('unjoined')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getUnjoinedChannels(
        @ReqUser() user: User
    ): Promise<Channel[]> {
        return this.channelsService.getUnjoinedChannels(Number(user.id));
    }

    //* Route for getting channel by id => http://${host}:${port}/api/channels/${channelId}
    @Get('/:channelId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getChannelById(@Param('channelId', ParseIntPipe) channelId: number): Promise<Channel> {
        return this.channelsService.getChannelById(channelId);
    }

    //* Route for getting the logged user role => http://${host}:${port}/api/channels/${channelId}/role
    @Get('/:channelId/role')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getLoggedUserRole(
        @ReqUser() user: User,
        @Param('channelId', ParseIntPipe) channelId: number
    ): Promise<UserChannel> {
        return this.channelsService.getLoggedUserRole(Number(user.id), channelId);
    }

    //* admins channel => http://${host}:${port}/api/channels/${channelId}/admins
    @Get('/:channelId/admins')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getChannelAdmins(
        @ReqUser() user: User,
        @Param('channelId', ParseIntPipe) channelId: number): Promise<UserChannel[]> {
        return this.channelsService.getChannelsMembersByRole(Number(user.id), Number(channelId), UserRole.ADMIN);
    }


    //* channel members => http://${host}:${port}/api/channels/${channelId}/members
    @Get('/:channelId/members')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getChannelMembers(
        @ReqUser() user: User,
        @Param('channelId', ParseIntPipe) channelId: number): Promise<UserChannel[]> {
        return this.channelsService.getChannelsMembersByRole(Number(user.id), Number(channelId), UserRole.MEMBER);
    }

    //* Route update channel =>    http://${host}:${port}/api/channels/channelId
    @Patch('/:channelId')
    @HttpCode(200)
    @UseGuards(RoleOwnerGuard)
    @UseGuards(JwtAuthGuard)
    updateChannel(
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body() data: UpdateChannelDto): Promise<Channel> {
        return this.channelsService.updateChannel(channelId, data);
    }

    //* Route delete channel */
    @Delete('/:channelId')
    @HttpCode(200)
    @UseGuards(RoleOwnerGuard)
    @UseGuards(JwtAuthGuard)
    deleteChannel(
        @Param('channelId', ParseIntPipe) channelId: number): Promise<any> {
        return this.channelsService.deleteChannel(Number(channelId));
    }

    //* Route add admin -> set a member as admin
    @Patch('/:channelId/add-new-admin')
    @HttpCode(200)
    @UseGuards(RoleOwnerGuard)
    @UseGuards(JwtAuthGuard)
    addNewAdmin(
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId', ParseIntPipe) memberId: number): Promise<any> {
        return this.channelsService.addAdmin(channelId, memberId);
    }

    //* Route remove admin -> change the status user to member */
    @Patch('/:channelId/remove-admin')
    @HttpCode(200)
    @UseGuards(RoleOwnerGuard)
    @UseGuards(JwtAuthGuard)
    removeAdmin(
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId', ParseIntPipe) memberId: number): Promise<any> {
        return this.channelsService.removeAdmin(channelId, memberId);
    }

    //* Route mute member ()-> set the user as mutant */
    @Patch('/:channelId/mute-user')
    @HttpCode(200)
    @UseGuards(RoleAdminGuard)
    @UseGuards(JwtAuthGuard)
    muteUser(
        @ReqUser() user: User,
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId', ParseIntPipe) memberId: number): Promise<any> {
        return this.channelsService.changeStatus(channelId, memberId, MemberStatus.MUTED);
    }

    //* route ban users
    @Patch('/:channelId/ban-user')
    @HttpCode(200)
    @UseGuards(RoleAdminGuard)
    @UseGuards(JwtAuthGuard)
    banUser(
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId', ParseIntPipe) memberId: number): Promise<any> {
        return this.channelsService.changeStatus(channelId, memberId, MemberStatus.BANNED);
    }

    //* route sert, update password
    @Patch('/:channelId/set-update-password')
    @HttpCode(200)
    @UseGuards(RoleOwnerGuard)
    @UseGuards(JwtAuthGuard)
    setUpdatePwd(
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('password') password: string
    ): Promise<any> {
        return this.channelsService.setUpdatePassword(channelId, password);
    }

    //* route kick users
    @Patch('/:channelId/kick-user')
    @HttpCode(200)
    @UseGuards(RoleAdminGuard)
    @UseGuards(JwtAuthGuard)
    kickUser(
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId', ParseIntPipe) memberId: number): Promise<any> {
        return this.channelsService.kickUser(memberId, channelId);
    }

    //* route unban users
    @Patch('/:channelId/unban-user')
    @HttpCode(200)
    @UseGuards(RoleAdminGuard)
    @UseGuards(JwtAuthGuard)
    unbanUser(
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId', ParseIntPipe) memberId: number): Promise<any> {
        return this.channelsService.unbanUser(channelId, memberId);
    }

    //* route unmute users
    @Patch('/:channelId/unmute-user')
    @HttpCode(200)
    @UseGuards(RoleAdminGuard)
    @UseGuards(JwtAuthGuard)
    unmuteUser(
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId', ParseIntPipe) memberId: number): Promise<any> {
        return this.channelsService.changeStatus(channelId, memberId, MemberStatus.ACTIVED);
    }
};