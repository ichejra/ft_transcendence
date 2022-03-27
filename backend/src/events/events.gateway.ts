import {
    Inject,
    Logger,
    UseFilters,
} from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException
} from "@nestjs/websockets";
import {
    Server,
    Socket
} from "socket.io";
import { WsExceptionsFilter } from "src/exceptions/ws-exceptions.filter";
import { ConnectionsService } from "./connections.service";

@UseFilters(new WsExceptionsFilter)
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

    public async handleDisconnect(client: Socket): Promise<void> {
        this.logger.log(`Client disconnected: ${client.id}`);
        try {
            await this.connectionsService.eraseConnection(client);
            client.disconnect();
        } catch (err) {
            throw new WsException('unauthorized connection');
        }
    }

    @SubscribeMessage('connection')
    async handleNewConnection(@ConnectedSocket() client: Socket) {
        try {
            await this.connectionsService.addConnection(client);
        } catch (err) {
            throw new WsException('unauthorized: unauthenticated connection');
        }
    }

    @SubscribeMessage('send_notification')
    async handleNotification(@ConnectedSocket() client: Socket, @MessageBody('userId') userId: number | string) {
        try {
            const targets: Set<Socket> = await this.connectionsService.getUserConnections(Number(userId));
            targets.forEach((target) => {
                this.server.to(target.id).emit('receive_notification');
            });
        } catch (err) {
            throw err;
        }
    }
}