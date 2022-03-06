import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { User } from 'src/users/entities/user.entity';


@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer()
  server; //https://docs.nestjs.com/websockets/gateways#server
  @SubscribeMessage('join_game')
  joinGame(client: Socket, user: User): void {}
  @SubscribeMessage('message')
  //when a client emits the message, The handleEvent() method will be executed.
  handleConnection(@MessageBody() message: string): void {
    // this.broadcast.emit('message', message);
  }
  handleDisconnect(@MessageBody() message: string): void {
    // this.broadcast.emit('message', message);
  }
  afterInit(server: any): any {
    // this.broadcast.emit('message', message);
  }
  // handleMessage(@MessageBody() message: string): void {
  //   // this.broadcast.emit('message', message);
  // }
}
// import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

// @WebSocketGateway(3000, {namespace: 'game'})
// export class GameGateway {
//   @SubscribeMessage('join_game')
//   joinGame(client: socket) : void {

//   }

// }



