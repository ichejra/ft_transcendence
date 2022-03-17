import {
    ConnectedSocket,
    MessageBody,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import {
    Inject,
    Logger
} from "@nestjs/common";
import {
    Server,
    Socket
} from "socket.io";
import { Message } from "src/channels/entities/message.entity";
import { ChannelsService } from "./channels.service";
import { MessagesService } from "./messages.service";
import { ConnectionsService } from "../events/connections.service";

@WebSocketGateway({  
    cors: {
        origin: '*', // http://frontend:port
    },
})
export class ChatGatway implements OnGatewayInit {    
    @WebSocketServer()
    private server: Server;

    @Inject()
    private channelsService: ChannelsService;
    
    @Inject()
    private messagesService: MessagesService;

    @Inject()
    private connectionsService: ConnectionsService;

    private logger: Logger = new Logger('ChatGateway');

    public async afterInit(server: Server) : Promise<void> {
        this.logger.log('Initialized');
    }

    @SubscribeMessage ('user_connection')
    async handleNewConnection(@ConnectedSocket() client: Socket) {
    }

    @SubscribeMessage('send_message')
    async handleMessage(@ConnectedSocket() client: Socket, payload: any) {
        const author = await this.connectionsService.getUserFromSocket(client);
        const { msg, channel } = payload;
        const message: Message = await this.messagesService.createMessage(author, msg);
       this.server.to(channel).emit('receive_message', message); 
    }

    @SubscribeMessage('join_channel')
    async handleJoinChannel(@ConnectedSocket() client: Socket, room: string) {
        const user = await this.connectionsService.getUserFromSocket(client);
        const channel = await this.channelsService.getChannelByName(room);
        // TODO:- check the channel privacy
        await this.channelsService.joinChannel(channel.id, user.id);
        client.join(room);
        // TODO: update user channel relation add the user
    }

    @SubscribeMessage('leave_channel')
    async handleLeaveChannel(@ConnectedSocket() client: Socket, room: string) {
        client.leave(room);
        // TODO: remove relation in user_channel table
    }
}