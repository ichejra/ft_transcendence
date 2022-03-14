import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { Message } from "./entities/message.entity";

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private messagesRepository: Repository<Message> ){}
    
        /* Messages */
    // used for saving msg to db
    createMessage = async (author: User, content: string) : Promise<Message> => {
        const newMessage = new Message(author, content);
        return await this.messagesRepository.save(newMessage);
    }

    // arrow function use for getting all messages
    getMessages = async (): Promise<Message[]> => {
        return await this.messagesRepository.find();
    }
}