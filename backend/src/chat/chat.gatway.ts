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
import { ChannelsService } from "./channels/channels.service";
import { Channel } from "./channels/entities/channel.entity";
import { MessageChannel } from "./messages/entities/message-channel.entity";
import { DirectChatService } from "./direct-chat/direct-chat.service";
import { ConnectionsService } from "src/events/connections.service";
import { ForbiddenException } from "src/exceptions/forbidden.exception";

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

    // ? handling messages for channels
    @SubscribeMessage('send_message_channel')
    async handleChannelMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        const channel: Channel = await this.channelsService.getChannelById(payload.channelId);
        const message: MessageChannel = await this.channelsService.saveMessage(client, channel, payload.content);
        this.server.to(channel.name).emit('receive_message_channel', message); 
    }

    @SubscribeMessage('join_channel')
    async handleJoinChannel(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        const channel: Channel = await this.channelsService.joinChannel(client, payload);
        if (!channel) {
            throw new ForbiddenException('Forbidden');
        }
        client.join(channel.name);
    }

    @SubscribeMessage('leave_channel')
    async handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        const channel: Channel = await this.channelsService.leaveChannel(client, payload);
        client.leave(channel.name);
    }

}