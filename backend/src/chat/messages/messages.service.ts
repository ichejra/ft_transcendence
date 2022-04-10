import {
    ForbiddenException,
    Injectable
} from '@nestjs/common';
import { UserFriends, UserFriendsRelation } from 'src/users/entities/user-friends.entity';
import { User } from "src/users/entities/user.entity";
import { Connection } from "typeorm";
import { Channel } from "../channels/entities/channel.entity";
import { DirectMessage } from './entities/direct-messages.entity';
import { MessageChannel } from './entities/message-channel.entity';

@Injectable()
export class MessagesService {
    constructor(
        private connection: Connection,
    ) { }

    //? Messages Channels
    createMessage = async (
        author: User,
        channel: Channel,
        content: string): Promise<MessageChannel> => {
        try {
            return await this.connection.getRepository(MessageChannel).save({
                author,
                channel,
                content,
            });
        } catch (err) {
            throw new ForbiddenException('Forbidden: cannot save the messsage');
        }
    }

    /* function return all the messages that's among to a given channel */
    private asyncFilterMsgs = async (
        messages: MessageChannel[],
        userId: number,
    ): Promise<MessageChannel[]> => {
        const toFilter = await Promise.all(messages.map(async (message: MessageChannel) => {
            const relation: UserFriends = await this.connection.getRepository(UserFriends).findOne({
                where: [{
                    applicant: userId,
                    recipient: message.author.id,
                    status: UserFriendsRelation.BLOCKED
                }, {
                    applicant: message.author.id,
                    recipient: userId,
                    status: UserFriendsRelation.BLOCKED
                }]
            });
            return (!relation) ? true : false;
        }))
        return messages.filter((_, index) => toFilter[index]);
    }

    getMessagesByChannelId = async (userId: number, channelId: number): Promise<MessageChannel[]> => {
        try {
            const messages: MessageChannel[] = await this
                .connection
                .getRepository(MessageChannel)
                .find({
                    relations: ['author', 'channel'],
                    where: {
                        channel: channelId
                    }
                });
            return await this.asyncFilterMsgs(messages, userId)
        } catch (err) {
            throw new ForbiddenException('Forbidden: cannot get the messsages');
        }
    }

    //? direct messages
    saveDirectMessage = async (
        sender: User,
        receiver: User,
        content: string): Promise<DirectMessage> => {
        try {

            return await this.connection.getRepository(DirectMessage).save({
                sender,
                receiver,
                content
            });
        } catch (err) {
            throw new ForbiddenException('cannot save the messsage');
        }
    }

    getAllDirectMessages = async (senderId: number, receiverId: number): Promise<DirectMessage[]> => {
        try {
            const messages: DirectMessage[] = await this.connection.getRepository(DirectMessage).find({
                relations: ['sender', 'receiver'],
                where: [{
                    sender: senderId,
                    receiver: receiverId
                }, {
                    sender: receiverId,
                    receiver: senderId
                }],
            });
            return messages;
        } catch (err) {
            throw err;
        }
    }

    // get the direct chat
    private asyncFilter = async (users: User[], userId: number): Promise<User[]> => {
        const toFilter = await Promise.all(users.map(async (user: User) => {
            const relation: UserFriends = await this.connection.getRepository(UserFriends).findOne({
                where: [{
                    applicant: userId,
                    recipient: user.id,
                    status: UserFriendsRelation.BLOCKED
                }, {
                    applicant: user.id,
                    recipient: userId,
                    status: UserFriendsRelation.BLOCKED
                }]
            });
            return (!relation) ? true : false;
        }))
        return users.filter((_, index) => toFilter[index]);
    }

    getDirectChat = async (userId: number): Promise<User[]> => {
        try {
            let users: User[] = await this.connection.getRepository(User).query(
                `SELECT * FROM users
                WHERE "users"."id"
                IN (SELECT DISTINCT "senderId" FROM direct_messages
                WHERE "direct_messages"."receiverId" = $1)
                OR "users"."id"
                IN (SELECT DISTINCT "receiverId" FROM direct_messages
                WHERE "direct_messages"."senderId" = $1)`,
                [userId]
            );
            return await this.asyncFilter(users, userId);
        } catch (err) {
            throw new ForbiddenException('connot get the direct chat!');
        }
    }
}
