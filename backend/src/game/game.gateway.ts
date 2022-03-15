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
// import { Consts, GameState } from './game_consts';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'game',
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

  handleDisconnect(socket: Socket): void {
    // TODO: handle disconnection
    // tstae
    let gameFound = this.games.find((game) => {
      return (
        game.getPlayersSockets()[0] === socket ||
        game.getPlayersSockets()[1] === socket
      );
    });
    if (gameFound) {
      gameFound.playerLeftGame(socket);
    }

  }
  afterInit(server: any): any {
    // ?
  }

  @SubscribeMessage('join_game')
  private joinGame(socketsArr: Socket[], payload: any): void {
    console.log('join game: am here');
    //TODO: change players state to inGame
    const game = new GameObj(
      new Player(socketsArr[0], true),
      new Player(socketsArr[1], false),
      this.removeGame.bind(this),
    );
    this.games.push(game);
    this.clearMatchFromQueue(game);
  }

  @SubscribeMessage('join_queue')
  private joinQueue(client: Socket, payload: any): void {
    console.log('join queue: am here');
    if (this.queue.has(client) === true) return;
    this.queue.add(client);
    if (this.queue.size > 1) {
      console.log(this.queue.size);
      const [first] = this.queue;
      const [, second] = this.queue;
      this.queue.clear();
      // console.log('first: ', first, 'second: ' , second);
      this.joinGame([first, second], '');
    }
  }
  //! ////////////////////////
  @SubscribeMessage('stop_game')
  private stopGame(socket: Socket, payload: any): void {
    //* change players state to online
    let gameFound = this.games.find((game) => {
      return (
        game.getPlayersSockets()[0] === socket ||
        game.getPlayersSockets()[1] === socket
      );
    });
    if (gameFound) {
      gameFound.stopGame();
    }
  }
  //! ////////////////////////

  private clearMatchFromQueue(game: GameObj): void {
    this.queue.delete(game.getPlayersSockets()[0]);
    this.queue.delete(game.getPlayersSockets()[1]);
  }

  private removeGame(game: GameObj) {
    this.clearMatchFromQueue(game);
    this.games.splice(this.games.indexOf(game), 1);
  }

  @SubscribeMessage('ArrowUp')
  handleUpPaddle(socket: Socket, key: string): void {
    let gameFound = this.games.find((game) => {
      return (
        game.getPlayersSockets()[0] === socket ||
        game.getPlayersSockets()[1] === socket
      );
    });
    if (gameFound) {
      let player = gameFound.getGamePlayer(socket);
      if (key === 'down') {
        player.getPaddle().move_forward('down');
      } else if (key === 'up') {
        player.getPaddle().move_forward('up');
      }
    }
  }

  @SubscribeMessage('ArrowDown')
  handleDownPaddle(socket: Socket, key: string): void {
    let gameFound = this.games.find((game) => {
      return (
        game.getPlayersSockets()[0] === socket ||
        game.getPlayersSockets()[1] === socket
      );
    });
    if (gameFound) {
      let player = gameFound.getGamePlayer(socket);
      if (key === 'down') {
        player.getPaddle().move_backward('down');
      } else if (key === 'up') {
        player.getPaddle().move_backward('up');
      }
    }
  }
}
