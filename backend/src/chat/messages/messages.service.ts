import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ForbiddenException } from 'src/exceptions/forbidden.exception';
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
    // used for saving msg to db
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
            throw new HttpException('cannot save the messsage', HttpStatus.FORBIDDEN);
        }
    }

    /* function return all the messages that's among to a given channel */
    getMessagesByChannelId = async (channelId: number): Promise<MessageChannel[]> => {
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
            return messages;
        } catch (err) {
            throw new ForbiddenException('Forbidden: can get messsages');
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
            throw new HttpException('cannot save the messsage', HttpStatus.FORBIDDEN);
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
            })
            return messages;
        } catch (err) {
            throw err;
        }
    }

    getDirectChat = async (userId: number): Promise<User[]> => {
        try {
            const users: User[] = await this.connection.getRepository(User).query(
                `SELECT id FROM users
                WHERE "users"."id"
                IN (SELECT DISTINCT "senderId" FROM direct_messages
                WHERE "direct_messages"."receiverId" = $1)
                OR "users"."id"
                IN (SELECT DISTINCT "receiverId" FROM direct_messages
                WHERE "direct_messages"."senderId" = $1)`,
                [userId]
            );
            return users;
        } catch (err) {
            throw new HttpException('entity error!', 400);
        }
    }
}
