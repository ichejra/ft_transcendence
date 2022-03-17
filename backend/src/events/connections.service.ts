import { Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import { User, UserState } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class ConnectionsService {

    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
        ){}

    private readonly connections: Map<number, Set<Socket>> = new Map<number, Set<Socket>>();
    
    /* function for getting user from socket by access token */
    public async getUserFromSocket(socket: Socket): Promise<User> {
        const accessToken = socket.handshake.auth.token;
        if (!accessToken) {
            throw new WsException('Unauthorized');
        }
        const user = await this.authService.getUserFromToken(accessToken);
        if (!user) {
            throw new WsException('Invalid token.');
        }
        return user;
    }
    
    // save user connections
    public addConnection = async (socket: Socket): Promise<any> => {
        let user: User = null;
        try {
            user = await this.getUserFromSocket(socket);
        } catch(e) {
            socket.disconnect(); // if the socket not authenticated will disconnect it
            return ;
        }
        let sockets: Set<Socket> = this.connections.get(user.id);
        if (!sockets) {
            await this.usersService.updateState(Number(user.id), UserState.ONLINE);
            sockets = new Set<Socket>();
            sockets.add(socket);
            this.connections.set(user.id, sockets);
        } else {
            sockets.add(socket);
            this.connections[user.id] = sockets;
        }
    }

    private printSet(sockets : Set<Socket>){
        sockets.forEach((sock)=>{
            console.log(sock.id, '\n');
        }
        );
    }

    // this function use for deleting the connection from connections array
    public eraseConnection = async (socket: Socket): Promise<any> => {
       let user: User;
        try {
            user = await this.getUserFromSocket(socket);
        } catch(e) {
            socket.disconnect(); // if the socket not authenticated should disconnect it
            return ;
        }
        const sockets: Set<Socket> = this.connections.get(user.id);
        if (sockets) {
            if (sockets.size === 0){
                await this.usersService.updateState(Number(user.id), UserState.OFFLINE);
                this.connections.delete(user.id);
            } else {
                this.connections[user.id] = sockets;
            }
        }
    }

    // Getting a all user connections
    public getUserConnections = async (userId: number) : Promise<Set<Socket>> => {
        return this.connections.get(userId);
    }

}