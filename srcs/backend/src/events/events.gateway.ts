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
import * as dotenv from "dotenv";

dotenv.config();
@UseFilters(new WsExceptionsFilter)
@WebSocketGateway({
    cors: process.env.FRONTEND_URL,
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
        try {
            await this.connectionsService.addConnection(client);
        } catch (err) {
            throw new WsException('unauthorized: unauthenticated connection');
        }
    }

    public async handleDisconnect(client: Socket): Promise<void> {
        this.logger.log(`Client disconnected: ${client.id}`);
        try {
            await this.connectionsService.eraseConnection(client);
        } catch (err) {
            throw new WsException('unauthorized connection');
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

    @SubscribeMessage('logout')
    async handleLogout(@ConnectedSocket() client: Socket) {
        await this.connectionsService.handleLogout(client);
    }

    @SubscribeMessage('block_status')
    async handleBlocking(@ConnectedSocket() client: Socket, @MessageBody() userId: number) {
        try {
            const targets: Set<Socket> = await this.connectionsService.getUserConnections(Number(userId));
            targets.forEach((target) => {
                this.server.to(target.id).emit('block_status');
            });
        } catch (err) {
            throw err;
        }
    }
}