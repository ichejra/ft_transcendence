import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { Channel } from "../entities/channel.entity";
import { Message } from "./entities/message.entity";

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private messagesRepository: Repository<Message> ){}
    
        /* Messages */
    // used for saving msg to db
    createMessage = async (
        author: User,
        channel: Channel,
        content: string) : Promise<Message> => {
        const newMessage = new Message(author, channel, content);
        return await this.messagesRepository.save(newMessage);
    }

    /* function return all the messages that's among to a given channel*/
    getMessagesByChannelId = async (channelId: number): Promise<Message[]> => {
        return await this.messagesRepository.query(
            `SELECT * FROM messages
            WHERE "messages"."channelId" = $1`,
            [channelId]
        );
    }

    // arrow function use for getting all messages
    getMessages = async (): Promise<Message[]> => {
        return await this.messagesRepository.find();
    }
}