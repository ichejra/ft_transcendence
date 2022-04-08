import {
    HttpStatus,
    Injectable, NotFoundException
} from "@nestjs/common";
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
import { WsException } from "@nestjs/websockets";
import { UserFriends, UserFriendsRelation } from "src/users/entities/user-friends.entity";

@Injectable()
export class ChannelsService {
    constructor(
        private connection: Connection,
        private messagesService: MessagesService,
        private connectionsService: ConnectionsService
    ) { }
    /* Channels */
    /* Method: create a new channel in database */
    async createChannel(user: User, channel: ChannelDto): Promise<UserChannel> {
        let newChannel: Channel;
        try {
            // password hashing§
            if (channel.type === ChannelType.PRIVATE) {
                const hashPwd = await bcrypt.hash(channel.password, 10);
                newChannel = new Channel(channel.name, ChannelType.PRIVATE, hashPwd);
            } else {
                newChannel = new Channel(channel.name, ChannelType.PUBLIC);
            }
            // save channel
            newChannel = await this.connection.getRepository(Channel).save(newChannel);
            // create relation between user and target channel
            return await this.connection.getRepository(UserChannel).save({
                user: user,
                channel: newChannel,
                userRole: UserRole.OWNER
            });
        } catch (err) {
            throw new ForbiddenException("Forbidden: cannot create a new channel.");
        }
    }

    // Get all channels
    getChannels = async (): Promise<Channel[]> => {
        try {
            return await this.connection.getRepository(Channel).find();
        } catch (err) {
            throw new NotFoundException("Channels not found.");
        }
    }

    /* get a channel by id */
    async getChannelById(channelId: number): Promise<UserChannel> {
        try {
            return await this.connection.getRepository(UserChannel).findOne({
                relations: ['user', 'channel'],
                where: {
                    channel: channelId,
                    userRole: UserRole.OWNER
                }
            });
        } catch (err) {
            throw new NotFoundException('Channel not found.');
        }
    }

    /* get the channel members */
    private asyncFilterMembers = async (members: UserChannel[], userId: number): Promise<UserChannel[]> => {
        const toFilter = await Promise.all(members.map(async (member: UserChannel) => {
            const relation: UserFriends = await this.connection.getRepository(UserFriends).findOne({
                where: [{
                    applicant: userId,
                    recipient: member.user.id,
                    status: UserFriendsRelation.BLOCKED
                }, {
                    applicant: member.user.id,
                    recipient: userId,
                    status: UserFriendsRelation.BLOCKED
                }]
            });
            return (!relation) ? true : false;
        }))
        return members.filter((_, index) => toFilter[index]);
    }
    getChannelsMembersByRole = async (userId: number, channelId: number, role?: UserRole): Promise<UserChannel[]> => {
        try {
            const members = await this.connection.getRepository(UserChannel).find({
                relations: ['user', 'channel'],
                where: [{
                    channel: channelId,
                    userRole: UserRole.ADMIN
                }, {
                    channel: channelId,
                    userRole: UserRole.MEMBER
                }]
            });
            return await this.asyncFilterMembers(members, userId);
        } catch (err) {
            throw err;
        }
    }

    //* get the logged user role
    getLoggedUserRole = async (userId: number, channelId: number): Promise<UserChannel> => {
        return await this.connection.getRepository(UserChannel).findOne({
            relations: ['user', 'channel'],
            where: {
                channel: channelId,
                user: userId
            }
        });
    }

    /* update channel */
    async updateChannel(channelId: number, data: UpdateChannelDto): Promise<Channel> {
        try {
            if (data.type === ChannelType.PRIVATE) {
                await this.setUpdatePassword(channelId, data.password);
            }
            await this.connection.getRepository(Channel).update(channelId, { name: data.name });
            return await this.connection.getRepository(Channel).findOne(channelId);
        } catch (err) {
            throw new NotFoundException('Channel not found.');
        }
    }

    /* delete channel */
    async deleteChannel(channelId: number): Promise<any> {
        // the user that will remove a channel from the database should be channel owner
        // check the user if he's the owner
        try {
            await this.connection.getRepository(UserChannel).query(
                `DELETE FROM user_channel
                WHERE "user_channel"."channelId" = $1`, [channelId,]
            );
            await this.connection.getRepository(Channel).delete(channelId);
            return { status: 200, success: true, message: 'channel has been removed.' };
        } catch (err) {
            throw new NotFoundException('Channel not found.');
        }
    }

    /* joining channel -> user_channel table updating */
    joinChannel = async (socket: Socket, payload: any): Promise<Channel> => {
        // get user and channel
        try {
            const channel = await this.connection.getRepository(Channel).findOne(payload.channelId);
            // check for channel type
            if (channel.type === ChannelType.PRIVATE) {
                // require a password
                const hashPwd = await bcrypt.compare(payload.password, channel.password);
                if (hashPwd === false) {
                    throw new WsException('Forbidden: incorrect password');
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
        } catch (err) {
            throw err;
        }

    }

    /* leave channel -> delete relation channel _ user */
    leaveChannel = async (socket: Socket, payload: any): Promise<Channel> => {
        // get user_channel relation
        const user = await this.connectionsService.getUserFromSocket(socket);
        const channel = await this.connection.getRepository(Channel).findOne(payload.channelId);
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
            [channel.id, user.id]
        );
        if (relation.userRole === UserRole.OWNER) {
            const admins = await this.connection.getRepository(UserChannel).query(
                `SELECT * FROM user_channel
                WHERE "user_channel"."channelId" = $1
                AND "user_channel"."userRole" = $2`,
                [channel.id, UserRole.ADMIN]
            );
            if (admins.length === 0) {
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
    addAdmin = async (channelId: number, userId: number): Promise<any> => {
        // update the userRole of the new admin to the admin
        try {
            await this.connection.getRepository(UserChannel).query(
                `UPDATE user_channel
                    SET "userRole" = $1
                    WHERE "channelId" = $2
                    AND "userId" = $3`,
                [UserRole.ADMIN, channelId, userId]
            );
        } catch (err) {
            throw err;
        }
        return { status: 200, success: true };

    }

    /* Remove admin */
    removeAdmin = async (channelId: number, userId: number): Promise<any> => {
        // update the userRole of the new admin to the admin
        await this.connection.getRepository(UserChannel).query(
            `UPDATE user_channel
                SET "userRole" = $1
                WHERE "channelId" = $2
                AND "userId" = $3`,
            [UserRole.MEMBER, channelId, userId]
        );
        return { status: 200, success: true };
    }

    /* change user status at the channel */
    changeStatus = async (
        channelId: number,
        memberId: number,
        status: MemberStatus): Promise<any> => {
        const isOwner = await this.connection.getRepository(UserChannel).findOne({
            where: {
                user: memberId,
                channel: channelId,
                userRole: UserRole.OWNER
            }
        });
        if (isOwner) {
            throw new ForbiddenException('Forbidden: permission denied: cannot mute or ban the channel owner');
        }
        await this.connection.getRepository(UserChannel).query(
            `UPDATE user_channel
            SET "userStatus" = $1
            WHERE "channelId" = $2
            AND "userId" = $3`,
            [status, channelId, memberId]
        );
        return { status: 200, success: true };
    }

    // Set or update password
    setUpdatePassword = async (channelId: number, newPwd: string): Promise<any> => {
        const hashPwd = await bcrypt.hash(newPwd, 10);
        await this.connection.getRepository(Channel).update(channelId, {
            password: hashPwd,
            type: ChannelType.PRIVATE
        });
        return { status: 200, success: true, message: 'Password changed' };
    }

    // Remove password
    removePassword = async (channelId: number): Promise<any> => {
        const channel = await this.connection.getRepository(Channel).findOne(channelId);
        if (channel.type === ChannelType.PRIVATE) {
            await this.connection.getRepository(Channel).update(channelId, {
                password: null,
                type: ChannelType.PUBLIC
            });
            return { status: 200, success: true, message: 'Password removed' };
        }
    }

    // saving messages
    saveMessage = async (socket: Socket, channel: Channel, content: string): Promise<MessageChannel> => {
        try {
            const author = await this.connectionsService.getUserFromSocket(socket);
            return await this.messagesService.createMessage(author, channel, content);
        } catch (err) {
            throw err;
        }
    }

    // kicking the user
    kickUser = async (userId: number, channelId: number): Promise<any> => {
        try {
            const isOwner = await this.connection.getRepository(UserChannel).findOne({
                where: {
                    channel: channelId,
                    user: userId,
                    userRole: UserRole.OWNER
                }
            });
            if (isOwner) {
                throw new ForbiddenException('Forbidden: you cannot kick the channel owner.')
            }
            await this.connection.getRepository(UserChannel).query(
                `DELETE FROM user_channel
                WHERE "user_channel"."channelId" = $1
                AND "user_channel"."userId" = $2`,
                [channelId, userId]
            );
            return { status: 200, success: true };
        } catch (err) {
            throw err;
        }
    }

    // getting the joined channels
    getJoinedChannels = async (userId: Number): Promise<Channel[]> => {
        try {
            return await this.connection.getRepository(Channel).query(
                `SELECT * FROM channels
                WHERE "channels"."id" IN (SELECT "channelId" FROM user_channel 
                WHERE "user_channel"."userId" = $1 AND "user_channel"."userStatus" != $2)`,
                [userId, MemberStatus.BANNED]
            );
        } catch (err) {
            throw err;
        }
    }

    // getting the unjoined channels
    getUnjoinedChannels = async (userId: number): Promise<Channel[]> => {
        try {
            const channels = await this.connection.getRepository(Channel).query(
                `SELECT * FROM channels
                WHERE "channels"."id"
                NOT IN (SELECT "channelId" FROM user_channel 
                WHERE "user_channel"."userId" = $1 AND "user_channel"."userStatus" != $2)`,
                [userId, MemberStatus.BANNED]
            );
            return channels;
        } catch (err) {
            throw err;
        }
    }

    // unban user
    unbanUser = async (channelId: number, memberId: number): Promise<any> => {
        // get the role of the user
        await this.connection.getRepository(UserChannel).query(
            `DELETE FROM user_channel
             WHERE "user_channel"."channelId" = $1
             AND "user_channel"."userId" = $2`,
            [channelId, memberId]
        )
        return { status: 200, success: true, message: 'the member has been unbaned' };
    }

    // room for blocked users by logged user
    async getBlockedRoom(author: User, sockets: any): Promise<string> {
        const room: string = 'blockedRoom';
        await Promise.all(sockets.map(async (socket: Socket) => {
            const user = await this.connectionsService.getUserFromSocket(socket);
            const relation = await this.connection.getRepository(UserFriends).findOne({
                where: [{
                    applicant: user.id,
                    recipient: author.id,
                    status: UserFriendsRelation.BLOCKED
                }, {
                    applicant: author.id,
                    recipient: user.id,
                    status: UserFriendsRelation.BLOCKED
                }]
            });
            if (relation) {
                socket.join(room);
            }
        }));
        return room;
    }
}