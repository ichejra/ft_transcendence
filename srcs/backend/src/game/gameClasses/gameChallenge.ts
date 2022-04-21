import { Socket } from 'socket.io';

export class gameChallenge {
  private _challenge_id: string;
  private _inviter: number;
  private _invitee: number;
  private _inviter_socket: Socket;
  private _gameType: string;

  constructor(
    id: string,
    inviter: number,
    invitee: number,
    inviter_scocket: Socket,
    gametype: string,
  ) {
    this._challenge_id = id;
    this._inviter = inviter;
    this._invitee = invitee;
    this._inviter_socket = inviter_scocket;
    this._gameType = gametype;
  }

  //* getters
  public getChallengeId(): string {
    return this._challenge_id;
  }

  public getInviter(): number {
    return this._inviter;
  }

  public getInvitee(): number {
    return this._invitee;
  }

  public getInviterSocket(): Socket {
    return this._inviter_socket;
  }

  public getGameType(): string {
    return this._gameType;
  }
}
