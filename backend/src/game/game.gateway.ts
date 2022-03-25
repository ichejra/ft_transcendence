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
import { LOADIPHLPAPI } from 'dns';
// import { Consts, GameState } from './game_consts';

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
  private defaultGameQueue: Socket[] = [];
  private obstacleGameQueue: Socket[] = [];

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
    let gameFound = this.games.find((game) => {
      return (
        game.getPlayersSockets()[0] === socket ||
        game.getPlayersSockets()[1] === socket
      );
    });
    if (gameFound) {
      gameFound.playerLeftGame(socket);
      gameFound.clearSpectators(); // TODO: watcher
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

  @SubscribeMessage('liveGames')
  private getLiveGames(client: Socket){
    if (this.games.length === 0){
      client.emit('liveGame_state', []);
    }
   const liveData = this.games.map((game)=>{
      return game.liveGameData();
    });
    client.emit('liveGame_state', liveData);
  }


  @SubscribeMessage('join_game')
  private async joinGame(socketsArr: Socket[], payload: any) {
    console.log('join game: am here');
    const game = new GameObj(
      new Player(socketsArr[0], true),
      new Player(socketsArr[1], false),
      await this.getPlayerAsUser(socketsArr[0]),
      await this.getPlayerAsUser(socketsArr[1]),
      this.removeGame.bind(this),
      payload === 'default',
    );
    socketsArr[0].emit('set_users', [
      await this.getPlayerAsUser(socketsArr[0]),
      await this.getPlayerAsUser(socketsArr[1]),
    ]);
    socketsArr[1].emit('set_users', [
      await this.getPlayerAsUser(socketsArr[0]),
      await this.getPlayerAsUser(socketsArr[1]),
    ]);
    this.games.push(game);
    this.clearMatchFromQueue(game);
  }

  @SubscribeMessage('join_queue')
  private async joinQueue(client: Socket, payload: any): Promise<void> {
    console.log('join queue: am here');
    if (this.queue.has(client) === true) return;
    this.queue.add(client);
    if (payload === 'obstacle') {
      this.obstacleGameQueue.push(client);
      if (this.obstacleGameQueue.length > 1) {
        console.log(this.obstacleGameQueue.length);
        const [first, second] = this.obstacleGameQueue;
        const user1 = await this.getPlayerAsUser(first);
        const user2 = await this.getPlayerAsUser(second);
        //* DONE (wa9): check the same user
        if (user1.id === user2.id) {
          this.obstacleGameQueue.splice(
            this.obstacleGameQueue.indexOf(first),
            1,
          );
          // this.queue.delete(first);
          return;
        }
        //* DONE: change players state to inGame
        await this.usersService.updateState(
          Number(user1.id),
          UserState.IN_GAME,
        );
        await this.usersService.updateState(
          Number(user2.id),
          UserState.IN_GAME,
        );
        // this.queue.clear();
        this.obstacleGameQueue.splice(0, this.obstacleGameQueue.length);
        this.joinGame([first, second], payload);
      }
    } else if (payload === 'default') {
      this.defaultGameQueue.push(client);
      if (this.defaultGameQueue.length > 1) {
        console.log(this.defaultGameQueue.length);
        const [first, second] = this.defaultGameQueue;
        const user1 = await this.getPlayerAsUser(first);
        const user2 = await this.getPlayerAsUser(second);
        //* DONE (wa9): check the same user
        if (user1.id === user2.id) {
          console.log('hi');
          this.defaultGameQueue.splice(this.defaultGameQueue.indexOf(first), 1);
          // this.queue.delete(first);
          return;
        }
        //* DONE: change players state to inGame
        await this.usersService.updateState(
          Number(user1.id),
          UserState.IN_GAME,
        );
        await this.usersService.updateState(
          Number(user2.id),
          UserState.IN_GAME,
        );
        this.defaultGameQueue.splice(0, this.defaultGameQueue.length);
        // this.queue.clear();
        this.joinGame([first, second], payload);
      }
    }
    // if (this.queue.size > 1) {
    //   console.log(this.queue.size);
    //   const [first, second] = this.queue;
    //   const user1 = await this.getPlayerAsUser(first);
    //   const user2 = await this.getPlayerAsUser(second);
    //   //* DONE (wa9): check the same user
    //   if (user1.id === user2.id) {
    //     console.log('hi');
    //     this.queue.delete(first);
    //     return ;
    //   }
    //   //* DONE: change players state to inGame
    //   await this.usersService.updateState(Number(user1.id), UserState.IN_GAME);
    //   await this.usersService.updateState(Number(user2.id), UserState.IN_GAME);
    //   this.queue.clear();
    //   this.joinGame([first, second], '');
    // }
  }
  // @SubscribeMessage('join_queue')
  // private async joinQueue(client: Socket, payload: any): Promise<void> {
  //   console.log('join queue: am here');
  //   if (this.queue.has(client) === true) return;
  //   this.queue.add(client);
  //   // if (payload === 'obstacle') {
  //   //   this.obstacleGameQueue.push(client);
  //   //   if (this.obstacleGameQueue.length > 1)
  //   //   {

  //   //   }
  //   // }
  //   if (this.queue.size > 1) {
  //     console.log(this.queue.size);
  //     const [first, second] = this.queue;
  //     const user1 = await this.getPlayerAsUser(first);
  //     const user2 = await this.getPlayerAsUser(second);
  //     //* DONE (wa9): check the same user
  //     if (user1.id === user2.id) {
  //       console.log('hi');
  //       this.queue.delete(first);
  //       return ;
  //     }
  //     //* DONE: change players state to inGame
  //     await this.usersService.updateState(Number(user1.id), UserState.IN_GAME);
  //     await this.usersService.updateState(Number(user2.id), UserState.IN_GAME);
  //     this.queue.clear();
  //     this.joinGame([first, second], '');
  //   }
  // }
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

  @SubscribeMessage('spectator')
  private watchGame(socket: Socket, payload: number) {
    console.log('hello from watch game');
    const gameFound = this.games.find((game) => {
      console.log('id ======= ', payload);
      if (game.hasUser(payload))
        return game;
    });
    if (gameFound)
    {
      console.log('watcher has been added');
      
      gameFound.addSpectators(socket);
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
