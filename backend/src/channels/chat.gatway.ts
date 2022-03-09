import { Logger } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    namespace: '/chat'
})
export class ChatGatway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    
    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger('ChatGateway');

    @SubscribeMessage('send_message')
    handleMessage(@MessageBody() data: string) {
        console.log(data);
        return this.server.sockets.emit('receive_message', data);
    }
    
    afterInit(server: Server) {
        console.log('Ha howa');
        this.logger.log('Init');
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket){
        this.logger.log(`Client disconnected: ${client.id}`);
    }
}