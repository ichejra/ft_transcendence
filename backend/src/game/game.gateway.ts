import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
}) 
export class GameGateway {
  @WebSocketServer()
  server;
  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string) : void {
    this.server.emit('message', message);
  }

}
// import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

// @WebSocketGateway(3000, {namespace: 'game'}) 
// export class GameGateway {
//   @SubscribeMessage('join_game')
//   joinGame(client: socket) : void {
    
//   }

// }