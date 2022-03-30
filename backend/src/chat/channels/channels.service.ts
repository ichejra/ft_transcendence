import {
    HttpException,
    HttpStatus,
    Injectable
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

@Injectable()
export class ChannelsService {
    constructor(
        private connection: Connection,
        private messagesService: MessagesService,
        private connectionsService: ConnectionsService
    ) { }
    /* Channels */
    /* Method: create a new channel in database */
    async createChannel(user: User, channel: ChannelDto): Promise<Channel> {
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
            await this.connection.getRepository(UserChannel).save({
                user: user,
                channel: newChannel,
                userRole: UserRole.OWNER
            });
            return newChannel;
        } catch (err) {
            throw new ForbiddenException("Forbidden: cannot create a new channel.");
        }
    }

    // Get all channels
    getChannels = async (): Promise<Channel[]> => {
        try {
            return await this.connection.getRepository(Channel).find();
        } catch (err) {
            throw new ForbiddenException("Forbidden: cannot get the channels.");
        }
    }

    /* get a channel by id */
    async getChannelById(channelId: number): Promise<Channel> {
        try {
            return await this.connection.getRepository(Channel).findOne(channelId);
        } catch (err) {
            throw new ForbiddenException('Forbidden: cannot get channels info.');
        }
    }

    /* get the channel members */
    getChannelsMembers = async (channelId: number): Promise<UserChannel[]> => {
        try {
            const members = await this.connection.getRepository(UserChannel).find({
                relations: ['user'],
                where: {
                    channel: channelId
                }
            });
            return members;
        } catch (err) {
            throw err;
        }
    }

    /* update channel */
    async updateChannel(userID: number, channelId: number, data: UpdateChannelDto): Promise<Channel> {
        try {
            if (data.type === ChannelType.PRIVATE) {
                await this.setUpdatePassword(userID, channelId, data.password);
            }
            await this.connection.getRepository(Channel).update(channelId, { name: data.name });
            return await this.connection.getRepository(Channel).findOne(channelId);
        } catch (err) {
            throw new ForbiddenException('Forbidden: cannot update channel');
        }
    }

    /* delete channel */
    async deleteChannel(userId: number, channelId: number): Promise<any> {
        // the user that will remove a channel from the database should be channel owner
        // check the user if he's the owner
        try {
            const role = await this.connection.getRepository(UserChannel).findOne({
                where: {
                    user: userId,
                    channel: channelId,
                    userRole: UserRole.OWNER,
                }
            });
            if (!role) {
                throw new HttpException("Forbidden: permission denied: you should be channel owner", HttpStatus.FORBIDDEN);
            }
            await this.connection.getRepository(UserChannel).query(
                `DELETE FROM user_channel
                WHERE "user_channel"."channelId" = $1`, [channelId,]
            );
            await this.connection.getRepository(Channel).delete(channelId);
            return { success: true, message: 'channel has been removed.' };
        } catch (err) {
            throw new ForbiddenException("Forbidden: permission denied");
        }
    }

    /* joining channel -> user_channel table updating */
    joinChannel = async (socket: Socket, payload: any): Promise<Channel> => {
        // get user and channel
        try {
            const channel = await this.getChannelById(payload.channelId);
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
                await this.deleteChannel(user.id, channel.id);
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
        const role = await this.connection.getRepository(UserChannel).findOne({
            where: {
                user: ownerId,
                channel: channelId,
                userRole: UserRole.OWNER
            }
        });
        if (!role) {
            throw new ForbiddenException('Forbidden: permission denied: you are not the channel owner.');
        }
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
        return { success: true };

    }

    /* Remove admin */
    removeAdmin = async (channelId: number, adminId: number, userId: number): Promise<any> => {
        // check that the user is owner
        const role = await this.connection.getRepository(UserChannel).findOne({
            where: {
                user: adminId,
                channel: channelId,
                userRole: (UserRole.OWNER || UserRole.ADMIN)
            }
        });
        if (!role) {
            throw new ForbiddenException('Forbidden: permission denied: you are not the channel owner.');
        }
        // update the userRole of the new admin to the admin
        await this.connection.getRepository(UserChannel).query(
            `UPDATE user_channel
                SET "userRole" = $1
                WHERE "channelId" = $2
                AND "userId" = $3`,
            [UserRole.MEMBER, channelId, userId]
        );
        return { success: true };
    }

    /* change user status at the channel */
    changeStatus = async (
        channelId: number,
        adminId: number,
        memberId: number,
        status: MemberStatus): Promise<any> => {
        const role = await this.connection.getRepository(UserChannel).findOne({
            where: {
                user: adminId,
                channel: channelId,
            }
        });
        if (role.userRole !== UserRole.ADMIN && role.userRole !== UserRole.OWNER) {
            throw new ForbiddenException('Forbidden: permission denied: you are not an admin of that channel.');
        }
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
        return { success: true };
    }

    // Set or update password
    setUpdatePassword = async (userId: number, channelId: number, newPwd: string): Promise<any> => {
        const role = await this.connection.getRepository(UserChannel).findOne({
            where: {
                user: userId,
                channel: channelId,
                userRole: UserRole.OWNER
            }
        });
        if (!role) {
            throw new ForbiddenException('Forbidden: permission denied: you are not the channel owner');
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
        if (channel.type === ChannelType.PRIVATE) {
            const role = await this.connection.getRepository(UserChannel).findOne({
                where: {
                    userId: userId,
                    channelId: channelId,
                    userRole: UserRole.OWNER
                }
            });
            if (role === undefined) {
                throw new ForbiddenException('Forbidden: permission denied: you are not the channel owner.');
            }
            await this.connection.getRepository(Channel).update(channelId, {
                password: null,
                type: ChannelType.PUBLIC
            });
            return { success: true, message: 'Password removed' };
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
    kickUser = async (adminId: number, userId: number, channelId: number): Promise<any> => {
        try {
            const role = await this.connection.getRepository(UserChannel).findOne({
                where: {
                    user: adminId,
                    channel: channelId,
                }
            });
            if (role.userRole !== UserRole.OWNER && role.userRole !== UserRole.ADMIN) {
                throw new ForbiddenException('Forbidden: permission denied: you do not have permission to kick user.');
            }
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
            return { success: true };
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
    getUnjoinedChannels = async (userId: Number): Promise<Channel[]> => {
        try {
            return await this.connection.getRepository(Channel).query(
                `SELECT * FROM channels
                WHERE "channels"."id"
                NOT IN (SELECT "channelId" FROM user_channel 
                WHERE "user_channel"."userId" = $1 AND "user_channel"."userStatus" != $2)`,
                [userId, MemberStatus.BANNED]
            );
        } catch (err) {
            throw err;
        }
    }

    // unban user
    unbanUser = async (userId: Number, channelId: number, memberId: number): Promise<any> => {
        // get the role of the user
         const role = await this.connection.getRepository(UserChannel).findOne({
             where: {
                 channel: channelId,
                 user: userId,
             }
         });
         if (role.userRole !== UserRole.OWNER && role.userRole !== UserRole.ADMIN) {
            throw new ForbiddenException('Forbidden: permission denied: you do not have permission to kick user.');
         }
         await this.connection.getRepository(UserChannel).query(
             `DELETE FROM user_channel
             WHERE "user_channel"."channelId" = $1
             AND "user_channel"."userId" = $2`,
             [ channelId, memberId ]
         )
         return { success: true, message: 'the member has been unbaned' };
    }
}