import { Injectable } from '@nestjs/common';
import { User } from "src/users/entities/user.entity";
import { Connection } from "typeorm";
import { Channel } from "../channels/entities/channel.entity";
import { MessageChannel } from './entities/message-channel.entity';


@Injectable()
export class MessagesService {
    constructor(
        private connection: Connection,
    ){}

    // ? Messages Channels
    // used for saving msg to db
    createMessage = async (
        author: User,
        channel: Channel,
        content: string) : Promise<MessageChannel> => {
        // const newMessage = new MessageChannel(author, channel, content);
        return await this.connection.getRepository(MessageChannel).save({
            author,
            channel,
            content,
        });
    }

    /* function return all the messages that's among to a given channel*/
    getMessagesByChannelId = async (channelId: number): Promise<MessageChannel[]> => {
        return await this.connection.getRepository(MessageChannel).query(
            `SELECT * FROM messages
            WHERE "messages"."channelId" = $1`,
            [channelId]
        );
    }

    // arrow function use for getting all messages
    getMessages = async (): Promise<MessageChannel[]> => {
        return await this.connection.getRepository(MessageChannel).find();
    }

    //? direct messages
}
