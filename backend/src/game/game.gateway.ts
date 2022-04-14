import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { User, UserState } from 'src/users/entities/user.entity';
import GameObj from 'src/game/gameClasses/pong';
import Player from 'src/game/gameClasses/player';
import { GameService } from './game.service';
import { GameDto } from './dto/game.dto';
import { Inject, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConnectionsService } from 'src/events/connections.service';
import { gameChallenge } from './gameClasses/gameChallenge';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  private games: GameObj[] = [];
  private queue: Set<Socket> = new Set<Socket>();
  private defaultGameQueue: Socket[] = [];
  private obstacleGameQueue: Socket[] = [];
  private challenges: gameChallenge[] = [];

  @WebSocketServer()
  server: Server;

  @Inject()
  private gameService: GameService;

  @Inject()
  private clientsService: ConnectionsService;

  @Inject()
  private usersService: UsersService;

  private logger: Logger = new Logger('GameGatway');

  public async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    try {
      await this.clientsService.addConnection(client);
    } catch (err) {
      // throw new WsException('unauthorized: unauthenticated connection'); // TODO check this with anouar
      return;
    }
  }

  public async handleDisconnect(socket: Socket): Promise<void> {
    console.log('Disconnected');
    try {
      await this.clientsService.eraseConnection(socket);
    } catch (err) {
      throw new WsException('unauthorized connection');
    }
    this.queue.delete(socket);
    if (this.defaultGameQueue.includes(socket))
      this.defaultGameQueue.splice(this.defaultGameQueue.indexOf(socket));
    if (this.obstacleGameQueue.includes(socket))
      this.obstacleGameQueue.splice(this.obstacleGameQueue.indexOf(socket));
    let gameFound = this.games.find((game) => {
      return (
        game.getPlayersSockets()[0] === socket ||
        game.getPlayersSockets()[1] === socket
      );
    });
    if (gameFound) {
      gameFound.playerLeftGame(socket);
      gameFound.clearSpectators();
    }
  }

  afterInit(server: any): any {
    this.logger.log('Initialized');
  }

  //* get players as users
  private async getPlayerAsUser(client: Socket): Promise<User> {
    let user: User = null;
    try {
      user = await this.clientsService.getUserFromSocket(client);
    } catch (error) {
      return;
    }
    return user;
  }

  //* to keep rendering the game when someone naviagtes to another page
  @SubscribeMessage('isAlreadyInGame')
  private isAlreadyInGame(client: Socket) {
    let gameFound = this.games.find((game) => {
      return (
        game.getPlayersSockets()[0] === client ||
        game.getPlayersSockets()[1] === client
      );
    });
    if (gameFound) {
      const users = [
        gameFound.getPlayer1AsUser(),
        gameFound.getPlayer2AsUser(),
      ];
      client.emit('set_users', users);
    }
  }

  //* check if the player is joined to a queue
  @SubscribeMessage('isJoined')
  private isJoined(client: Socket) {
    if (this.queue.has(client) === true) {
      client.emit('joined', true);
      return;
    }
  }

  //* start playing
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
    this.removeMatchFromQueue(game);
  }

  //* manage the game type queue
  private async gameTypeQueue(
    gameQueue: Socket[],
    client: Socket,
    type: string,
  ) {
    gameQueue.push(client);
    if (gameQueue.length > 1) {
      console.log(gameQueue.length);
      const [first, second] = gameQueue;
      const user1 = await this.getPlayerAsUser(first);
      const user2 = await this.getPlayerAsUser(second);
      if (user1.id === user2.id) {
        gameQueue.splice(gameQueue.indexOf(first), 1);
        // first.emit('unjoin_queue');
        return;
      }
      await this.usersService.updateState(Number(user1.id), UserState.IN_GAME);
      await this.usersService.updateState(Number(user2.id), UserState.IN_GAME);
      gameQueue.splice(0, gameQueue.length);
      this.joinGame([first, second], type);
    }
  }

  //* join the queue
  @SubscribeMessage('join_queue')
  private async joinQueue(client: Socket, payload: string): Promise<void> {
    console.log('join queue: am here ', payload);
    if (this.queue.has(client) === true) return;
    this.queue.add(client);
    if (payload === 'obstacle') {
      console.log('obstacleGameQueue: am here');
      this.gameTypeQueue(this.obstacleGameQueue, client, 'obstacle');
      // this.obstacleGameQueue.push(client);
      // if (this.obstacleGameQueue.length > 1) {
      //   console.log(this.obstacleGameQueue.length);
      //   const [first, second] = this.obstacleGameQueue;
      //   const user1 = await this.getPlayerAsUser(first);
      //   const user2 = await this.getPlayerAsUser(second);
      //   if (user1.id === user2.id) {
      //     this.obstacleGameQueue.splice(
      //       this.obstacleGameQueue.indexOf(first),
      //       1,
      //     );
      //     return;
      //   }
      //   await this.usersService.updateState(
      //     Number(user1.id),
      //     UserState.IN_GAME,
      //   );
      //   await this.usersService.updateState(
      //     Number(user2.id),
      //     UserState.IN_GAME,
      //   );
      //   this.obstacleGameQueue.splice(0, this.obstacleGameQueue.length);
      //   this.joinGame([first, second], payload);
      // }
    } else if (payload === 'default') {
      console.log('defaultGameQueue: am here');
      this.gameTypeQueue(this.defaultGameQueue, client, 'default');
      // this.defaultGameQueue.push(client);
      // console.log(this.defaultGameQueue.length);
      // if (this.defaultGameQueue.length > 1) {
      //   const [first, second] = this.defaultGameQueue;
      //   const user1 = await this.getPlayerAsUser(first);
      //   const user2 = await this.getPlayerAsUser(second);
      //   if (user1.id === user2.id) {
      //     this.defaultGameQueue.splice(this.defaultGameQueue.indexOf(first), 1);
      //     return;
      //   }
      //   await this.usersService.updateState(
      //     Number(user1.id),
      //     UserState.IN_GAME,
      //   );
      //   await this.usersService.updateState(
      //     Number(user2.id),
      //     UserState.IN_GAME,
      //   );
      //   this.defaultGameQueue.splice(0, this.defaultGameQueue.length);
      //   this.joinGame([first, second], payload);
      // }
    }
  }

  //* Stop Game
  //TODO: maybe remove this
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

  private removeMatchFromQueue(game: GameObj): void {
    this.queue.delete(game.getPlayersSockets()[0]);
    this.queue.delete(game.getPlayersSockets()[1]);
  }

  //*remove finished game from queue and save its data
  private async removeGame(game: GameObj) {
    const user1 = await this.getPlayerAsUser(game.getPlayer1().getSocket());
    const user2 = await this.getPlayerAsUser(game.getPlayer2().getSocket());
    console.log('-----------------------------------');
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
    this.removeMatchFromQueue(game);
    this.games.splice(this.games.indexOf(game), 1);
  }

  //* handle movements
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

  //* Live games functions
  @SubscribeMessage('liveGames')
  private getLiveGames(client: Socket) {
    if (this.games.length === 0) {
      client.emit('liveGame_state', []);
    }
    const liveData = this.games.map((game) => {
      return game.liveGameData();
    });
    client.emit('liveGame_state', liveData);
  }

  @SubscribeMessage('spectator')
  private watchGame(socket: Socket, payload: number) {
    console.log('hello from watch game');
    const gameFound = this.games.find((game) => {
      console.log('id ======= ', payload);
      if (game.hasUser(payload)) return game;
    });
    if (gameFound) {
      console.log('watcher has been added');

      gameFound.addSpectators(socket);
    }
  }

  @SubscribeMessage('spectator_left')
  private removeSpectator(socket: Socket) {
    const gameFound = this.games.find((game) => game.hasSpectator(socket));
    if (gameFound) {
      console.log('I should be removed here');
      gameFound.removeSpectator(socket);
    }
  }

  //* Game Request

  private generateId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  @SubscribeMessage('invite_to_game')
  async inviteToGame(
    client: Socket,
    payload: { inviter: User; invitee: User; gameType: string },
  ) {
    // const gameFound = this.games.find((game) => {
    //   return (
    //     game.getPlayersSockets()[0] === client ||
    //     game.getPlayersSockets()[1] === client
    //   );
    // });
    const inviterJoinedGame = this.games.find((game) => {
      return game.hasUser(payload.inviter.id);
    });
    const inviteeJoinedGame = this.games.find((game) => {
      return game.hasUser(payload.invitee.id);
    });
    if (inviterJoinedGame) {
      client.emit('inviter_in_game');
      return;
    }
    if (inviteeJoinedGame) {
      client.emit('invitee_in_game', { user: payload.invitee });
      return;
    }
    const challengeId = this.generateId();
    const challenge = new gameChallenge(
      challengeId,
      payload.inviter.id,
      payload.invitee.id,
      client,
      payload.gameType,
    );
    try {
      const inviteeSockets: Set<Socket> =
        await this.clientsService.getUserConnections(
          Number(payload.invitee.id),
        );
      console.log(inviteeSockets.size);
      inviteeSockets.forEach((sock) => {
        this.server.to(sock.id).emit('game_invitation', {
          inviter: payload.inviter,
          challengeId: challengeId,
        });
        console.log('cha %s --- sock %s', challengeId, sock.id);
      });
      this.challenges.push(challenge);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //* accept challenge
  @SubscribeMessage('accept_challenge')
  private async accpetChallenge(
    client: Socket,
    payload: { challengeId: string },
  ) {
    console.log('%cCHALLENGE ACCEPTED', payload.challengeId);

    //TODO : remove players from all queues
    const challenge = this.challenges.find((challenge) => {
      return challenge.getChallengeId() === payload.challengeId;
    });
    if (challenge) {
      challenge.getInviterSocket().emit('challenge_accepted', {
        challengeId: challenge.getChallengeId(),
      });
      //* DONE changed state for invitation game players players
      const inviter = await this.getPlayerAsUser(challenge.getInviterSocket());
      const invitee = await this.getPlayerAsUser(client);
      await this.usersService.updateState(
        Number(inviter.id),
        UserState.IN_GAME,
      );
      await this.usersService.updateState(
        Number(invitee.id),
        UserState.IN_GAME,
      );
      this.joinGame(
        [challenge.getInviterSocket(), client],
        challenge.getGameType(),
      );
    }
  }

  //* reject challenge
  @SubscribeMessage('reject_challenge')
  private rejectChallenge(
    client: Socket,
    payload: { challengeId: string; loggedUser: User },
  ) {
    console.log('%cCHALLENGE REJECTED', payload.challengeId);
    const challenge = this.challenges.find((challenge) => {
      return challenge.getChallengeId() === payload.challengeId;
    });
    if (challenge) {
      challenge.getInviterSocket().emit('challenge_rejected', {
        user: payload.loggedUser,
      });
      this.challenges.splice(this.challenges.indexOf(challenge), 1);
    }
  }
}

//TODO: check if blocked users can play with each other
//TODO: add game invit in profile
//TODO: make the game responsive waaaaaaaaaaaaaaaaaaaaaaaaaa3
//TODO: refactor the shit
//TODO: update the obstacle game

