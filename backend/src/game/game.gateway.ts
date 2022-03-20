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
import { User, UserState } from 'src/users/entities/user.entity';
import GameObj from 'src/game/interfaces/game';
import Player from 'src/game/interfaces/player';
import { Game } from './entities/game.entity';
import { GameService } from './game.service';
import { GameDto } from './dto/game.dto';
import { Inject } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConnectionsService } from 'src/events/connections.service';
// import { Consts, GameState } from './game_consts';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  // namespace: 'game', //! remove it later
})
export class GameGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  private games: GameObj[] = [];
  private queue: Set<Socket> = new Set<Socket>(); // players in queue

  @WebSocketServer()
  server; //https://docs.nestjs.com/websockets/gateways#server

  @Inject()
  private gameService: GameService;

  @Inject()
  private clientsService: ConnectionsService;
  @Inject()
  private usersService: UsersService;

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

  private async getPlayerAsUser(client: Socket): Promise<User> {
    let user: User = null;
    try {
      user = await this.clientsService.getUserFromSocket(client);
    } catch (error) {
      return;
    }
    return user;
  }

  @SubscribeMessage('join_game')
  private async joinGame(socketsArr: Socket[], payload: any) {
    console.log('join game: am here');
    const game = new GameObj(
      new Player(socketsArr[0], true),
      new Player(socketsArr[1], false),
      await this.getPlayerAsUser(socketsArr[0]),
      await this.getPlayerAsUser(socketsArr[1]),
      // await this.clientsService.getUserFromSocket(socketsArr[0]),
      // await this.clientsService.getUserFromSocket(socketsArr[1]),
      this.removeGame.bind(this),
    );
    this.games.push(game);
    this.clearMatchFromQueue(game);
  }

  @SubscribeMessage('join_queue')
  private async joinQueue(client: Socket, payload: any): Promise<void> {
    console.log('join queue: am here');
    if (this.queue.has(client) === true) return;
    this.queue.add(client);
    if (this.queue.size > 1) {
      console.log(this.queue.size);
      const [first, second] = this.queue;
      const user1 = await this.getPlayerAsUser(first);
      const user2 = await this.getPlayerAsUser(second);
      //* DONE (wa9): check the same user
      if (user1.id === user2.id) {
        console.log('hi');
        this.queue.delete(first);
        return ;
      }
      //* DONE: change players state to inGame
      await this.usersService.updateState(Number(user1.id), UserState.IN_GAME);
      await this.usersService.updateState(Number(user2.id), UserState.IN_GAME);
      this.queue.clear();
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

  private async removeGame(game: GameObj) {
    //* DONE: set data in database
    const user1 = await this.getPlayerAsUser(game.getPlayer1().getSocket());
    const user2 = await this.getPlayerAsUser(game.getPlayer2().getSocket());
    console.log('-----------------------------------');
    //* DONE: chenge players state to online 
    await this.usersService.updateState(Number(user1.id), UserState.ONLINE);
    await this.usersService.updateState(Number(user2.id), UserState.ONLINE);
    const GameData = new GameDto();
    GameData.score = `${game.getPlayer1().getScore()}-${game
      .getPlayer2()
      .getScore()}`;
    GameData.winner = await this.clientsService.getUserFromSocket(
      game.getWinnerSocket(),
    );
    GameData.loser = await this.clientsService.getUserFromSocket(
      game.getLoserSocket(),
    );
    this.gameService.insertGameData(GameData);
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
