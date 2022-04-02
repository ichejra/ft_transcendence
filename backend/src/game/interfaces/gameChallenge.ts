import { Socket } from 'socket.io';
import { User } from 'src/users/entities/user.entity';

export class gameChallenge {
  private _challenge_id: string;
  // private _inviter: User;
  // private _invitee: User;
  private _inviter: number;
  private _invitee: number;
  private _inviter_socket: Socket;

  constructor(id: string, inviter: number, invitee: number, inviter_scocket: Socket) {
    this._challenge_id = id;
    this._inviter = inviter;
    this._invitee = invitee;
    this._inviter_socket = inviter_scocket;
  }

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
}

//TODO: change inviter and invitee from ids to users 
