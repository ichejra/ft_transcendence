import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
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
import { ClientsService } from "./clients.service";

@WebSocketGateway({  
    cors: {
        origin: '*', // http://frontend:port
    },
})
export class ChatGatway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {    
    @WebSocketServer()
    private server: Server;

    @Inject()
    private channelsService: ChannelsService;
    
    @Inject()
    private messagesService: MessagesService;

    @Inject()
    private clientsService: ClientsService;

    private logger: Logger = new Logger('ChatGateway');

    public async afterInit(server: Server) : Promise<void> {
        this.logger.log('Chat Gateway Initialized');
    }

    public async handleConnection(client: Socket, ...args: any[]): Promise<void>{
        this.logger.log(`Client connected: ${client.id}`);
        await this.clientsService.addConnection(client);
        //! client.emit() target the client
    }

    public async handleDisconnect(client: Socket) : Promise<void> {
        this.logger.log(`Client disconnected: ${client.id}`);
        await this.clientsService.eraseConnection(client);
    }

    @SubscribeMessage ('user_connection')
    async handleNewConnection(@ConnectedSocket() client: Socket) {
        await this.clientsService.addConnection(client);
    }

    @SubscribeMessage('send_message')
    async handleMessage(@ConnectedSocket() client: Socket, payload: any) {
        const author = await this.clientsService.getUserFromSocket(client);
        const { msg, channel } = payload;
        const message: Message = await this.messagesService.createMessage(author, msg);
       this.server.to(channel).emit('receive_message', message); 
    }

    @SubscribeMessage('join_channel')
    async handleJoinChannel(@ConnectedSocket() client: Socket, room: string) {
        const user = await this.clientsService.getUserFromSocket(client);
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