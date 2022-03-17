import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { Socket } from "socket.io";
import { ChannelDto } from "./dto/channel.dto";
import { UpdateChannelDto } from "./dto/update-channel.dto";
import {
    Channel,
    ChannelType
} from "./entities/channel.entity";
import {
    MemberStatus,
    UserChannel,
    UserRole
} from "./entities/user-channel.entity";
import { Message } from "./messages/entities/message.entity";
import { MessagesService } from "./messages/messages.service";
import { ConnectionsService } from "src/events/connections.service";

@Injectable()
export class ChannelsService {
    constructor(
        @InjectRepository(Channel)
        private channelsRepository: Repository<Channel>,
        @InjectRepository(UserChannel)
        private userChannelRepository: Repository<UserChannel>,
        private messagesService: MessagesService,
        private connectionsService: ConnectionsService
        ) {}
    /* Channels */
    /* Method: create a new channel in database */
    async createChannel(user: User, channel: ChannelDto) : Promise<Channel> {
        // save channel
        const channel_ = await this.channelsRepository.save(channel);
        // create relation between user and target channel
        await this.userChannelRepository.save({
            user: user,
            channel: channel_,
            userRole: UserRole.OWNER
        });
        return channel_;
    }

    /* get a channel by id */
    async getChannelById(channelId: number): Promise<Channel> {
        return await this.channelsRepository.findOne(channelId);
    }

    /* get a channel by name */
    async getChannelByName(name: string): Promise<Channel> {
        return await this.channelsRepository.findOne(name);
    }

    /* update channel */
    async updateChannel(channelId: number, data: UpdateChannelDto): Promise<Channel> {
        return await this.channelsRepository.update(channelId, data).then( async () => { 
            return await this.channelsRepository.findOne(channelId);
        });
    }

    /* delete channel */
    async deleteChannel(channelId: number): Promise<any> {
        // check the user if he's the owner
        await this.userChannelRepository.query(
            `DELETE FROM user_channel
            WHERE "user_channel"."channelId" = $1`, [ channelId ]
        );
        return await this.channelsRepository.delete(channelId);
    }

    /* joining channel -> user_channel table updating */
    joinChannel = async (socket: Socket, payload: any) : Promise<Channel> => {
        // get user and channel
        const user = await this.connectionsService.getUserFromSocket(socket);
        // TODO:- check the channel privacy
        const channel = await this.getChannelById(payload.channelId);
        if (channel.type === ChannelType.PRIVATE)
        {
            // require a password
        }
        // update user channel relation add the user
        await this.userChannelRepository.save({
            user: user,
            channel: channel,
            userRole: UserRole.MEMBER
        })
        return channel;
    }

    /* leave channel -> (if Owner then destroy channel) delete relation or banned the user */
    leaveChannel = async (socket: Socket, payload: any) : Promise<Channel> => {
        // get user_channel relation
        const user = await this.connectionsService.getUserFromSocket(socket);
        const channel = await this.getChannelById(payload.channelId);
        const relation = await this.userChannelRepository.findOne({
            where: {
                user,
                channel
            }
        });
        // remove relation in user_channel
        await this.userChannelRepository.query(
            `DELETE FROM user_channel
            WHERE "user_channel"."channelId" = $1
            AND "user_channel"."userId" = $2`,
            [ channel.id, user.id ]
        );
        if (relation.userRole === UserRole.OWNER) { // ! Destroy channel
            await this.deleteChannel(channel.id);
        }
        return channel;
    }

    /* Add admin to a channel */
    addAdmin = async (channelId: number, ownerId: number, userId: number): Promise<any> => {
        // check that the user is owner
        const userChannel = await this.userChannelRepository.findOne({
            where: {
                user: ownerId,
                channel: channelId
            }
        });
        if (userChannel.userRole === UserRole.OWNER) {
            // update the userRole of the new admin to the admin
            await this.userChannelRepository.query(
                `UPDATE user_channel
                SET "state" = $1
                WHERE "channelId" = $2
                AND "userId" = $3`,
                [ UserRole.ADMIN, channelId, userId ]  
            );
        }
    }

    /* Remove admin */
    removeAdmin = async (channelId: number, adminId: number, userId: number): Promise<any> => {
        // check that the user is owner
        const userChannel = await this.userChannelRepository.findOne({
            where: {
                user: adminId,
                channel: channelId,
                userRole: (UserRole.OWNER || UserRole.ADMIN)
            }
        });
        // update the userRole of the new admin to the admin
        if (userChannel) {
            await this.userChannelRepository.query(
                `UPDATE user_channel
                SET "state" = $1
                WHERE "channelId" = $2
                AND "userId" = $3`,
                [ UserRole.MEMBER, channelId, userId ]  
            );
        }
    }

    /* change user status at the channel */
    changeStatus = async (
        channelId: number,
        adminId: number,
        memberId: number,
        status: MemberStatus): Promise<any> => {
        
        const userChannel = await this.userChannelRepository.findOne({
            where: {
                user: adminId,
                channel: channelId,
                userRole: (UserRole.OWNER || UserRole.ADMIN)
            }
        });
        if (userChannel) {
            await this.userChannelRepository.query(
                `UPDATE user_channel
                SET "userStatus" = $1
                WHERE "channelId" = $2
                AND "userId" = $3`,
                [ status, channelId, memberId]
            );
        }
    }

    // saving messages
    saveMessage = async (socket: Socket, channel: Channel, content: string): Promise<Message> => {
        const author = await this.connectionsService.getUserFromSocket(socket);
        return await this.messagesService.createMessage(author, channel, content);
    }
}