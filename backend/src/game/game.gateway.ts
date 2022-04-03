import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { User, UserState } from 'src/users/entities/user.entity';
import GameObj from 'src/game/interfaces/game';
import Player from 'src/game/interfaces/player';
import { GameService } from './game.service';
import { GameDto } from './dto/game.dto';
import { Inject } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConnectionsService } from 'src/events/connections.service';
import { gameChallenge } from './interfaces/gameChallenge';

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
  server: Server; //https://docs.nestjs.com/websockets/gateways#server

  @Inject()
  private gameService: GameService;

  @Inject()
  private clientsService: ConnectionsService;

  @Inject()
  private usersService: UsersService;

  // handleConnection(client: Socket): void {
  //   // TODO: handle connection
  // }

  //! ***************************************************
  public async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    try {
      await this.clientsService.addConnection(client);
    } catch (err) {
      // throw new WsException('unauthorized: unauthenticated connection'); // TODO check this with anouar
      return;
    }
  }
  //! ***************************************************

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
      gameFound.clearSpectators();
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
  private getLiveGames(client: Socket) {
    if (this.games.length === 0) {
      client.emit('liveGame_state', []);
    }
    const liveData = this.games.map((game) => {
      return game.liveGameData();
    });
    client.emit('liveGame_state', liveData);
  }

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
      console.log('users', users);

      client.emit('set_users', users);
    }
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

  @SubscribeMessage('isJoined')
  private isJoined(client: Socket) {
    if (this.queue.has(client) === true) {
      client.emit('joined', true);
      return;
    }
  }

  @SubscribeMessage('join_queue')
  private async joinQueue(client: Socket, payload: string): Promise<void> {
    console.log('join queue: am here ', payload);
    // client.emit('joined');
    if (this.queue.has(client) === true) return;
    this.queue.add(client);
    if (payload === 'obstacle') {
      console.log('obstacleGameQueue: am here');
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
        // check the relation status between user1 and user2 blocked
        // isBlocked true : false
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
      console.log('defaultGameQueue: am here');
      this.defaultGameQueue.push(client);
      console.log(this.defaultGameQueue.length);
      if (this.defaultGameQueue.length > 1) {
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
        this.joinGame([first, second], payload);
      }
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
  //*************************************************** */ game request

  private generateId(): string {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  }
  private generateId2(): string {
    let id: string = '';
    let characters: string =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength: number = characters.length;
    for (let i: number = 0; i < 25; i++) {
      id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return id;
  }
  @SubscribeMessage('invite_to_game')
  async inviteToGame(
    client: Socket,
    payload: { inviter: User; invitee: User },
    // payload: { inviter: User; invitee: User },
  ) {
    //! payload: inviter id and invitee id
    // console.log(payload);

    const gameFound = this.games.find((game) => {
      return (
        game.getPlayersSockets()[0] === client ||
        game.getPlayersSockets()[1] === client
      );
    });
    //TODO: what to do here
    if (gameFound) return;
    const challengeId = this.generateId();
    const challenge = new gameChallenge(
      challengeId,
      payload.inviter.id,
      payload.invitee.id,
      client,
    );
    // console.log('paylaod.invitee ', payload.invitee);
    try {
      const inviteeSockets: Set<Socket> =
        await this.clientsService.getUserConnections(
          Number(payload.invitee.id),
        );
      inviteeSockets.forEach((sock) => {
        this.server
          .to(sock.id)
          .emit('game_invitation', { inviter: payload.inviter, challengeId: challengeId });
          console.log('cha id =======> ',challengeId);
          
      });
      this.challenges.push(challenge);
    } catch (error) {
      console.log(error);
      throw error;
    }
    // sockets.forEach((socket) => {
    //   socket.emit('game_invitation', { inviter: payload.inviter, challengeId });
    // });
  }
  //* /////////////////////////////////////////////////////////////////////////////////////
  @SubscribeMessage('accept_challenge')
  accpetChallenge(client: Socket, payload: { challengeId: string }) {
    console.log('%cCHALLENGE ACCEPTED', 'color: yellow', payload.challengeId);
    
    //TODO : remove players from all queues
    const challenge = this.challenges.find((challenge) => {
      return challenge.getChallengeId() === payload.challengeId;
    });
    if (challenge) {
      challenge
        .getInviterSocket()
        .emit('challenge_accepted', challenge.getChallengeId());
      this.joinGame([challenge.getInviterSocket(), client], 'default'); //TODO: change game type
    }
  }
  //* /////////////////////////////////////////////////////////////////////////////////////
  @SubscribeMessage('reject_challenge')
  rejectChallenge(client: Socket, payload: { challengeId: string }) {
    console.log('%cCHALLENGE REJECTED', 'color: yellow', payload.challengeId);
    const challenge = this.challenges.find((challenge) => {
      return challenge.getChallengeId() === payload.challengeId;
    });
    if (challenge) {
      challenge
        .getInviterSocket()
        .emit('challenge_rejected', challenge.getChallengeId());
      this.challenges.splice(this.challenges.indexOf(challenge), 1);
    }
  }
  //* /////////////////////////////////////////////////////////////////////////////////////
}

//TODO: check if blocked users can play with each other
//TODO: send game type when invite to game
//TODO: add game invit in profile
//TODO: add game types on a modal when inviting someone
//TODO: make the game responsive waaaaaaaaaaaaaaaaaaaaaaaaaa3
//TODO: refactor the shit



