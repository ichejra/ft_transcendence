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
import { Message } from "src/channels/messages/entities/message.entity";
import { ChannelsService } from "./channels.service";
import { MessagesService } from "./messages/messages.service";
import { ConnectionsService } from "../events/connections.service";
import { Channel } from "./entities/channel.entity";

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

    // @Inject()
    // private connectionsService: ConnectionsService;

    private logger: Logger = new Logger('ChatGateway');

    public async afterInit(server: Server) : Promise<void> {
        this.logger.log('Initialized');
    }

    // TODO: add some stuff for a direct messages here

    @SubscribeMessage('send_message')
    async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        const channel: Channel = await this.channelsService.getChannelById(payload.channelId);
        const message: Message = await this.channelsService.saveMessage(client, channel, payload.content);
       this.server.to(channel.name).emit('receive_message', message); 
    }

    @SubscribeMessage('join_channel')
    async handleJoinChannel(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        const channel: Channel = await this.channelsService.joinChannel(client, payload);
        client.join(channel.name);
    }

    @SubscribeMessage('leave_channel')
    async handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        const channel: Channel = await this.channelsService.leaveChannel(client, payload);
        client.leave(channel.name);
    }
}