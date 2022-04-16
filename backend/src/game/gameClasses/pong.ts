import { Socket } from 'socket.io';
import { Consts } from '../constants/gameConsts';
import { GameStates } from '../constants/gameState';
import { BroadcastObject } from '../constants/brodcastObject';
import { User } from 'src/users/entities/user.entity';
import Ball from './ball';
import Player from './player';

class GameObj {
  private _id: string;
  private _player1: Player;
  private _player2: Player;
  private _player1AsUser: User;
  private _player2AsUser: User;
  private _ball: Ball;
  private _remove: Function;
  private _spectators: Socket[] = [];
  private _interval: NodeJS.Timer;
  private _isDefault: boolean;

  constructor(
    player1: Player,
    player2: Player,
    user1: User,
    user2: User,
    removeGame: Function,
    isDefault: boolean,
  ) {
    this._player1 = player1;
    this._player2 = player2;
    this._player1AsUser = user1;
    this._player2AsUser = user2;
    this._ball = new Ball();
    this._remove = removeGame;
    this._interval = setInterval(
      () => this.playGame(),
      1000 / Consts.framePerSec,
    );
    this._isDefault = isDefault;
  }

  //* getters
  public getIsDefault(): boolean {
    return this._isDefault;
  }
  public getId(): string {
    return this._id;
  }
  public getPlayer1(): Player {
    return this._player1;
  }
  public getPlayer2(): Player {
    return this._player2;
  }
  public getPlayer1AsUser(): User {
    return this._player1AsUser;
  }
  public getPlayer2AsUser(): User {
    return this._player2AsUser;
  }
  public getGamePlayer(playerSocket: Socket): Player {
    return this._player1.getSocket() === playerSocket
      ? this._player1
      : this._player2;
  }
  public getInterval() {
    return this._interval;
  }
  public getWinnerSocket(): Socket {
    if (this._player1.isWinner()) return this._player1.getSocket();
    else return this._player2.getSocket();
  }
  public getLoserSocket(): Socket {
    if (!this._player1.isWinner()) return this._player1.getSocket();
    else return this._player2.getSocket();
  }
  public getPlayersSockets = (): Socket[] => {
    return [this._player1.getSocket(), this._player2.getSocket()];
  };

  private dataToBeSent = (): BroadcastObject => {
    return {
      ball: {
        x: this._ball.getX(),
        y: this._ball.getY(),
      },
      paddles: {
        leftPad: this._player1.getPaddle().getY(),
        rightPad: this._player2.getPaddle().getY(),
        leftPadH: this._player1.getPaddle().getHeight(),
        rightPadH: this._player2.getPaddle().getHeight(),
      },
      score: {
        score1: this._player1.getScore(),
        score2: this._player2.getScore(),
      },
      state: this.gameState(),
    };
  };

  //* send game frames
  public sendData = () => {
    const current = this.dataToBeSent();

    this._player1
      .getSocket()
      .emit('game_state', { ...current, isWinner: this._player1.isWinner() });
    this._player2
      .getSocket()
      .emit('game_state', { ...current, isWinner: this._player2.isWinner() });
    this._spectators.forEach((spec) => {
      spec.emit('game_state', { ...current });
    });
  };

  public resetGame(): void {
    this._ball.resetBall();
    this._player1.getPaddle().resetPaddle();
    this._player2.getPaddle().resetPaddle();
  }

  public hasUser(userId: number): boolean {
    if (userId === this._player1AsUser.id || userId === this._player2AsUser.id)
      return true;
    return false;
  }

  public hasSocket(client: Socket): boolean {
    if (client === this._player1.getSocket() || this._player2.getSocket() === client)
      return true;
    return false;
  }

  //* get game state
  public gameState = (): GameStates => {
    if (
      this._player1.getScore() === Consts.MAX_SCORE ||
      this._player2.getScore() === Consts.MAX_SCORE
    ) {
      return GameStates.OVER;
    } else return GameStates.ON;
  };

  public stopGame(): void {
    clearInterval(this._interval);
    this.clearSpectators();
    this._player1.clearPlayer();
    this._player2.clearPlayer();
    this._remove(this);
  }

  private handleCollision(player: Player): void {
    let collidePoint =
      this._ball.getY() - (player.getPaddle().getY() + Consts.PADDLE_H / 2);
    collidePoint = collidePoint / (Consts.PADDLE_H / 2);
    let angleRad = (Math.PI / 4) * collidePoint;
    let direction =
      this._ball.getX() + Consts.BALL_RADIUS < Consts.CANVAS_W / 2 ? 1 : -1;
    this._ball.setVelocityX(
      direction * this._ball.getSpeed() * Math.cos(angleRad),
    );
    this._ball.setVelocityY(this._ball.getSpeed() * Math.sin(angleRad));
    this._ball.setSpeed(this._ball.getSpeed() + 0.3);
    if (!this._isDefault) {
      player
      .getPaddle()
      .setHeight(Math.floor(Math.random() * (100 - 40 + 1) + 40));
    }
  }

  //* handle all game componnents movements
  public playGame(): void {
    this._ball.ballHorizontalBounce();
    if (this._ball.PaddleBallCollision(this._player1.getPaddle())) {
      this.handleCollision(this._player1);
    }
    if (this._ball.PaddleBallCollision(this._player2.getPaddle())) {
      this.handleCollision(this._player2);
    }
    if (this._ball.getX() - Consts.BALL_RADIUS <= 0) {
      this._player2.incScore();
      this.resetGame();
    } else if (this._ball.getX() + Consts.BALL_RADIUS >= Consts.CANVAS_W) {
      this._player1.incScore();
      this.resetGame();
    }
    this._ball.moveBall();
    this.sendData();
    if (this.gameState() === GameStates.OVER) {
      this.stopGame();
    }
  }

  //* end game and penalize the player if they left the game
  public playerLeftGame = (client: Socket): void => {
    if (this._player1.getSocket() === client) {
      this._player1.setScore(0);
      this._player2.setScore(Consts.MAX_SCORE);
    } else if (this._player2.getSocket() === client) {
      this._player2.setScore(0);
      this._player1.setScore(Consts.MAX_SCORE);
    }
    this.sendData();
    this.stopGame();
  };

  // * add spectators
  public addSpectators(spectator: Socket): void {
    if (this._spectators.length < Consts.MAX_SPECTATORS) {
      this._spectators.push(spectator);
      spectator.emit('set_users', [this._player1AsUser, this._player2AsUser]);
    }
  }

  //* clear spectators
  public clearSpectators(): void {
    if (this._spectators.length > 0)
      this._spectators.splice(0, this._spectators.length);
  }

  //* remove a spectator
  public removeSpectator(spectator: Socket): void {
    if (this._spectators.includes(spectator))
      this._spectators.splice(this._spectators.indexOf(spectator), 1);
  }

  //* check if the game has spectator
  public hasSpectator(spec: Socket) {
    return this._spectators.includes(spec);
  }

  //* data for live games page
  public liveGameData = () => {
    return {
      players: {
        player1: this._player1AsUser,
        player2: this._player2AsUser,
      },
      score: {
        score1: this._player1.getScore(),
        score2: this._player2.getScore(),
      },
    };
  }
}

export default GameObj;
