import {
    Inject,
    Logger
} from "@nestjs/common";
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
    Server,
    Socket
} from "socket.io";
import { ConnectionsService } from "./connections.service";
@WebSocketGateway({
    cors: true,
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    
    @WebSocketServer()
    private server: Server;

    @Inject()
    private connectionsService: ConnectionsService;

    private logger: Logger = new Logger('EventsGateway');

 
    public async afterInit(server: Server): Promise<void> {
        this.logger.log('Initialized');
    }

    public async handleConnection(client: Socket, ...args: any[]): Promise<void> {
        this.logger.log(`Client connected: ${client.id}`);
    }

    public async handleDisconnect(client: Socket) : Promise<void> {
        this.logger.log(`Client disconnected: ${client.id}`);
        await this.connectionsService.eraseConnection(client);
        client.disconnect();
    }

    @SubscribeMessage('connection')
    async handleNewConnection(@ConnectedSocket() client: Socket) {
        await this.connectionsService.addConnection(client);
    }

    @SubscribeMessage('send_notification')
    async handleNotification(@ConnectedSocket() client: Socket, @MessageBody('userId') userId: number | string) {
        const targets: Set<Socket> = await this.connectionsService.getUserConnections(Number(userId));
        targets.forEach((target) => {
            this.server.to(target.id).emit('receive_notification');
        });
    }
}