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
    Logger,
    UseFilters,
    UsePipes,
    ValidationPipe
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
import { WsExceptionsFilter } from "src/exceptions/ws-exceptions.filter";

@UseFilters(WsExceptionsFilter)
@UsePipes(new ValidationPipe())
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

    public async afterInit(server: Server): Promise<void> {
        this.logger.log('Initialized');
    }

    // ? handling messages for direct chat
    @SubscribeMessage('send_message')
    async handleDirectMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        try {
            const message = await this.directChatService.saveMessage(client, payload);
            const receiverSockets = await this.connectionsService.getUserConnections(payload.receiverId);
            receiverSockets.forEach((sock) => {
                this.server.to(sock.id).emit('receive_message', message);
            });
        } catch (error) {
            throw new WsException('forbidden');
        }
    }

    @SubscribeMessage('create_channel')
    async handleCreateChannel(@ConnectedSocket() client: Socket, @MessageBody() payload: ChannelDto) {
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
        try {
            const channel: Channel = await this.channelsService.getChannelById(payload.channelId);
            const message: MessageChannel = await this.channelsService.saveMessage(client, channel, payload.content);
            this.server.to(channel.name).emit('receive_message_channel', message);
        } catch (error) {
            throw new WsException('forbidden');
        }
    }

    @SubscribeMessage('join_channel')
    async handleJoinChannel(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        try {
            const channel: Channel = await this.channelsService.joinChannel(client, payload);
            client.join(channel.name);
            this.server.to(channel.name).emit('join_success', { message: "success", status: 200 });
        } catch (error) {
            throw error;
        }
    }

    // ? handling joining after refeshing
    @SubscribeMessage('update_join')
    async handleUpdate(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        const { rooms, room } = payload;
        rooms.forEach((room: any) => {
            client.leave(room.name);
        });
        client.join(room.name);
    }

    // ? leaving channel handle
    @SubscribeMessage('leave_channel')
    async handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        try {
            const channel: Channel = await this.channelsService.leaveChannel(client, payload);
            client.leave(channel.name);
            this.server.to(channel.name).emit('leave_success', { message: "success", status: 200, channelId: channel.id });
        } catch (error) {
            throw new WsException('leave the channel unsuccessfully.');
        }
    }

    // ? handling member status changing 
    @SubscribeMessage('member_status_changed')
    async handleChangeStatus(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        client.to(payload.room).emit('member_status_changed', { status: payload.status, time: payload.time});
    }
}