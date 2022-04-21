import { Injectable } from "@nestjs/common";
import { ConnectionsService } from "src/events/connections.service";
import { DirectMessage } from "../messages/entities/direct-messages.entity";
import { MessagesService } from "../messages/messages.service";

@Injectable()
export class DirectChatService {
    constructor(
        private messageService: MessagesService,
        private connectionsService: ConnectionsService
        ) {}
    
    // saving direct message into the database
    saveMessage = async (socket: any, payload: any): Promise<DirectMessage> => {
        const sender = await this.connectionsService.getUserFromSocket(socket);
        const receiver = await this.connectionsService.getReceiverById(payload.receiverId);
        return await this.messageService.saveDirectMessage(sender, receiver, payload.content);
    }

    // getting messages by sender and receiver
    getAllMessages = async (senderId: number, receiverId: number) : Promise<DirectMessage[]> => {
        return await this.messageService.getAllDirectMessages(senderId, receiverId);
    }
}