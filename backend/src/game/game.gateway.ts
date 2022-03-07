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
import GameObj from 'src/game/interfaces/game';
import Player from 'src/game/interfaces/player';
import { Game } from './entities/game.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  private games: GameObj[] = [];
  private queue: Set<Socket> = new Set<Socket>(); // players in queue

  @WebSocketServer()
  server; //https://docs.nestjs.com/websockets/gateways#server

  handleConnection(client: Socket): void {
    // TODO: handle connection
  }
  handleDisconnect(client: Socket): void {
    // TODO: handle disconnection
  }
  afterInit(server: any): any {
    // ?
  }

  @SubscribeMessage('join_game')
  private joinGame(socketsArr: Socket[], payload: any): void {
    const newGame = new GameObj(
      new Player(socketsArr[0], true),
      new Player(socketsArr[1], false),
    );
    this.games.push(newGame);
  }

  @SubscribeMessage('join_queue')
  private joinQueue(client: Socket, payload: any): void {
    if (this.queue.has(client) === true)
      return;
    this.queue.add(client);
    if (this.queue.size > 1)
    {
      const [first] = this.queue;
      const [, second] = this.queue;
      this.joinGame([first, second], '');
    }
  }

  private clearQueue(game: GameObj) : void {
    this.queue.delete(game.getPlayersSockets()[0]);
    this.queue.delete(game.getPlayersSockets()[1]);
  }






}




