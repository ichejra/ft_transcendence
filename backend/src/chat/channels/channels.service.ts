import { Injectable } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { Connection } from "typeorm";
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
import { MessagesService } from "../messages/messages.service";
import { ConnectionsService } from "src/events/connections.service";
import { MessageChannel } from "../messages/entities/message-channel.entity";
import * as bcrypt from "bcrypt";
import { ForbiddenException } from "src/exceptions/forbidden.exception";

@Injectable()
export class ChannelsService {
    constructor(
        private connection: Connection,
        private messagesService: MessagesService,
        private connectionsService: ConnectionsService
        ) {}
    /* Channels */
    /* Method: create a new channel in database */
    async createChannel(user: User, channel: ChannelDto) : Promise<Channel> {
        // ! check channel type to hASH THE PASSWORD
        let newChannel: Channel;
        try {
            if (channel.type === ChannelType.PRIVATE) {
                const hashPwd = await bcrypt.hash(channel.password, 10);
                newChannel = new Channel(channel.name, ChannelType.PRIVATE, hashPwd);
            } else {
                newChannel = new Channel(channel.name, ChannelType.PUBLIC);
            }
            // save channel
                newChannel = await this.connection.getRepository(Channel).save(newChannel);
            // create relation between user and target channel
            await this.connection.getRepository(UserChannel).save({
                user: user,
                channel: newChannel,
                userRole: UserRole.OWNER
            });
        } catch (err) {
            throw new ForbiddenException();
        }
        return newChannel;
    }

    // Get all channels
    getChannels = async (): Promise<Channel[]> => {
        return await this.connection.getRepository(Channel).find();
    }

    /* get a channel by id */
    async getChannelById(channelId: number): Promise<Channel> {
        return await this.connection.getRepository(Channel).findOne(channelId);
    }

    /* get a channel by name */
    async getChannelByName(name: string): Promise<Channel> {
        return await this.connection.getRepository(Channel).findOne(name);
    }

    /* update channel */
    async updateChannel(channelId: number, data: UpdateChannelDto): Promise<Channel> {
        return await this.connection.getRepository(Channel).update(channelId, data).then( async () => { 
            return await this.connection.getRepository(Channel).findOne(channelId);
        });
    }

    /* delete channel */
    async deleteChannel(channelId: number): Promise<any> {
        // check the user if he's the owner
        await this.connection.getRepository(UserChannel).query(
            `DELETE FROM user_channel
            WHERE "user_channel"."channelId" = $1`, [ channelId ]
        );
        return await this.connection.getRepository(Channel).delete(channelId);
    }

    /* joining channel -> user_channel table updating */
    joinChannel = async (socket: Socket, payload: any) : Promise<Channel> => {
        // get user and channel
        const channel = await this.getChannelById(payload.channelId);
        // check for channel type
        if (channel.type === ChannelType.PRIVATE) {
            // require a password
            const hashPwd = await bcrypt.compare(payload.password, channel.password);
            if (hashPwd === false) {
                return null;
            }
        }
        // get the user§
        const user = await this.connectionsService.getUserFromSocket(socket);
        // update user channel relation add the user
        await this.connection.getRepository(UserChannel).save({
            user: user,
            channel: channel,
            userRole: UserRole.MEMBER
        })
        return channel;
    }

    /* leave channel -> delete relation channel _ user */
    leaveChannel = async (socket: Socket, payload: any) : Promise<Channel> => {
        // get user_channel relation
        const user = await this.connectionsService.getUserFromSocket(socket);
        const channel = await this.getChannelById(payload.channelId);
        const relation = await this.connection.getRepository(UserChannel).findOne({
            where: {
                user,
                channel
            }
        });
        // remove relation in user_channel
        await this.connection.getRepository(UserChannel).query(
            `DELETE FROM user_channel
            WHERE "user_channel"."channelId" = $1
            AND "user_channel"."userId" = $2`,
            [ channel.id, user.id ]
        );
        if (relation.userRole === UserRole.OWNER) {
            const admins = await this.connection.getRepository(UserChannel).query(
                `SELECT * FROM user_channel
                WHERE "user_channel"."channelId" = $1
                AND "user_channel"."userRole" = $2`,
                [ channel.id, UserRole.ADMIN ]
            );
            if (admins.length === 0){
                await this.deleteChannel(channel.id);
            } else {
                await this.connection.getRepository(UserChannel).update({
                        user: admins[0],
                        channel: channel
                    }, { userRole: UserRole.OWNER });
            }
        }
        return channel;
    }

    /* Add admin to a channel */
    addAdmin = async (channelId: number, ownerId: number, userId: number): Promise<any> => {
        // check that the user is owner
        const userChannel = await this.connection.getRepository(UserChannel).findOne({
            where: {
                user: ownerId,
                channel: channelId
            }
        });
        if (userChannel.userRole === UserRole.OWNER) {
            // update the userRole of the new admin to the admin
            await this.connection.getRepository(UserChannel).query(
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
        const userChannel = await this.connection.getRepository(UserChannel).findOne({
            where: {
                user: adminId,
                channel: channelId,
                userRole: (UserRole.OWNER || UserRole.ADMIN)
            }
        });
        // update the userRole of the new admin to the admin
        if (userChannel) {
            await this.connection.getRepository(UserChannel).query(
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
        
        const userChannel = await this.connection.getRepository(UserChannel).findOne({
            where: {
                user: adminId,
                channel: channelId,
                userRole: (UserRole.OWNER || UserRole.ADMIN)
            }
        });
        if (userChannel) {
            await this.connection.getRepository(UserChannel).query(
                `UPDATE user_channel
                SET "userStatus" = $1
                WHERE "channelId" = $2
                AND "userId" = $3`,
                [ status, channelId, memberId]
            );
        }
    }

    // Set or update password
    setUpdatePassword = async (userId: number, channelId :number, newPwd: string): Promise<any> => {
        const relation = await this.connection.getRepository(UserChannel).findOne({
            where:{
                userId: userId,
                channelId: channelId,
                userRole: UserRole.OWNER
            }
        });
        if (relation === undefined) {
            throw new ForbiddenException('Forbidden: permission denied');
        }
        const hashPwd = await bcrypt.hash(newPwd, 10);
        await this.connection.getRepository(Channel).update(channelId, {
            password: hashPwd,
            type: ChannelType.PRIVATE
        });
        return { success: true, message: 'Password changed' };
    }

    // Remove password
    removePassword = async (userId: number, channelId: number): Promise<any> => {
        const channel = await this.connection.getRepository(Channel).findOne(channelId);
        if (channel.type === ChannelType.PRIVATE){

        }
        const relation = await this.connection.getRepository(UserChannel).findOne({
            where:{
                userId: userId,
                channelId: channelId,
                userRole: UserRole.OWNER
            }
        });
        if (relation === undefined) {
            throw new ForbiddenException('Forbidden: permission denied');
        }
        await this.connection.getRepository(Channel).update(channelId, {
            password: null,
            type: ChannelType.PUBLIC
        });
        return {success: true, message: 'Password removed'};
    }

    // saving messages
    saveMessage = async (socket: Socket, channel: Channel, content: string): Promise<MessageChannel> => {
        const author = await this.connectionsService.getUserFromSocket(socket);
        return await this.messagesService.createMessage(author, channel, content);
    }
}