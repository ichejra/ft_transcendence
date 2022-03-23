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
        return this.channelsService.getChannelById(Number(channelId));
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
        return this.channelsService.removeAdmin(channelId, Number(_req.user.id), memberId);
    }
    /* Route mute member ()-> set the user as mutant */
    @Patch('mute-user/:channelId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    muteUser(
        @Req() _req: any,
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId') memberId: number): Promise<any> {
        return this.channelsService.changeStatus(channelId, Number(_req.user.id), memberId, MemberStatus.MUTED);
    }

    @Patch('ban-user/:channelId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    banUser(
        @Req() _req: any,
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body('memberId') memberId: number): Promise<any> {
        return this.channelsService.changeStatus(channelId, Number(_req.user.id), memberId, MemberStatus.BANNED);
    }

    @Patch('set-update-password/:channelId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    setUpdatePwd(
        @Req() _req: any,
        @Param('channelId') channelId: number,
        @Body('password') password: string
    ) : Promise<any> {
        console.log(password);
        // return ;
        return this.channelsService.setUpdatePassword(Number(_req.user.id), channelId, password);
    }
};