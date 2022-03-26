import {
    ConnectedSocket,
    MessageBody,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException
} from "@nestjs/websockets";
import {
    Inject,
    Logger
} from "@nestjs/common";
import {
    Server,
    Socket
} from "socket.io";
import { ChannelsService } from "./channels/channels.service";
import { Channel } from "./channels/entities/channel.entity";
import { MessageChannel } from "./messages/entities/message-channel.entity";
import { DirectChatService } from "./direct-chat/direct-chat.service";
import { ConnectionsService } from "src/events/connections.service";
import { ChannelDto } from "./channels/dto/channel.dto";

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
    private directChatService: DirectChatService;
    @Inject()
    private connectionsService: ConnectionsService;

    private logger: Logger = new Logger('ChatGateway');

    public async afterInit(server: Server) : Promise<void> {
        this.logger.log('Initialized');
    }

    // ? handling messages for direct chat
    @SubscribeMessage('send_message')
    async handleDirectMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        const message = await this.directChatService.saveMessage(client, payload);
        const receiverSockets = await this.connectionsService.getUserConnections(payload.receiverId);
        receiverSockets.forEach((sock) => {
            this.server.to(sock.id).emit('receive_message', message);
        });
    }

    @SubscribeMessage('create_channel')
    async handleCreateChannel(@ConnectedSocket() client: Socket, @MessageBody() payload: ChannelDto) {
        console.log(payload);
        try {
            const user = await this.connectionsService.getUserFromSocket(client);
            await this.channelsService.createChannel(user, payload);
        } catch (error) {
            throw new WsException('cannot create channel');
        }
        client.join(payload.name);
    }

    // ? handling messages for channels
    @SubscribeMessage('send_message_channel')
    async handleChannelMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        const channel: Channel = await this.channelsService.getChannelById(payload.channelId);
        const message: MessageChannel = await this.channelsService.saveMessage(client, channel, payload.content);
        this.server.to(channel.name).emit('receive_message_channel', message); 
    }
    
    @SubscribeMessage('join_channel')
    async handleJoinChannel(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        console.log(payload);
        const channel: Channel = await this.channelsService.joinChannel(client, payload);
        if (!channel) {
            throw new WsException('Forbidden');
        }
        client.join(channel.name);
    }

    // ? handling joining after refeshing
    @SubscribeMessage('update_join')
    async handleUpdate(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        const { rooms } = payload;
        rooms.forEach((room: any) => {
            client.join(room.name);
        });
    }

    @SubscribeMessage('leave_channel')
    async handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        const channel: Channel = await this.channelsService.leaveChannel(client, payload);
        client.leave(channel.name);
    }

}