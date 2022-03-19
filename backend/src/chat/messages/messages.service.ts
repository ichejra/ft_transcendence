import { Injectable } from '@nestjs/common';
import { User } from "src/users/entities/user.entity";
import { Connection } from "typeorm";
import { Channel } from "../channels/entities/channel.entity";
import { DirectMessage } from './entities/direct-messages.entity';
import { MessageChannel } from './entities/message-channel.entity';


@Injectable()
export class MessagesService {
    constructor(
        private connection: Connection,
    ){}

    //? Messages Channels
    // used for saving msg to db
    createMessage = async (
        author: User,
        channel: Channel,
        content: string) : Promise<MessageChannel> => {
        return await this.connection.getRepository(MessageChannel).save({
            author,
            channel,
            content,
        });
    }

    /* function return all the messages that's among to a given channel*/
    getMessagesByChannelId = async (channelId: number): Promise<MessageChannel[]> => {
        return await this.connection.getRepository(MessageChannel).query(
            `SELECT * FROM messages_channles
            WHERE "messages_channles"."channelId" = $1`,
            [channelId]
        );
    }

    // arrow function use for getting all messages
    getMessages = async (): Promise<MessageChannel[]> => {
        return await this.connection.getRepository(MessageChannel).find();
    }

    //? direct messages
    saveDirectMessage = async (
        sender: User,
        receiver: User,
        content: string): Promise<DirectMessage> => {
        return await this.connection.getRepository(DirectMessage).save({
            sender,
            receiver,
            content
        });
    }

    getAllDirectMessages = async (senderId: number, receiverId: number) : Promise<DirectMessage[]> => {
        return await this.connection.getRepository(DirectMessage).query(
            `SELECT * FROM direct_messages
            WHERE ("direct_messages"."senderId" = $1 AND "direct_messages"."receiverId" = $2)
            OR ("direct_messages"."senderId" = $2 AND "direct_messages"."receiverId" = $1)`,
            [ senderId, receiverId ]
        );
    }
}
