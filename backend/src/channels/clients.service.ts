import { Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { parse } from "cookie";
import { Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import { User, UserState } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { UserConnections } from "./models/user-connections.model";

@Injectable()
export class ClientsService {

    constructor(
        private usersService: UsersService,
        private authService: AuthService,
        ){}

    private sockets = new Array<Socket>();
    private connections = new Map<number, Array<Socket>>();
    
    /* function for getting user from socket by access token */
    async getUserFromSocket(socket: Socket): Promise<User> {
        const accessToken = socket.handshake.auth.key;
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
    addConnection = async (socket: Socket): Promise<any> => {
        let user: User = null;
        try {
            user = await this.getUserFromSocket(socket);
        } catch(e) {
            return ;
        }
        const keyCheck = this.connections.has(user.id);
        if (!keyCheck) {
            await this.usersService.updateState(Number(user.id), UserState.ONLINE);
        }
        this.sockets.push(socket);
        this.connections.set(user.id, this.sockets);
        this.sockets = [];
    }

    // this function use for deleting the connection from connections array
    eraseConnection = async (socket: Socket): Promise<any> => {
       let user: User = null;
        try {
            user = await this.getUserFromSocket(socket);
        } catch(e) {
            return ;
        }
        this.sockets = this.connections.get(user.id).filter((sock) => { 
            return sock.id !== socket.id;
        });
        if (!this.sockets.length){
            await this.usersService.updateState(Number(user.id), UserState.OFFLINE);
            this.connections.delete(user.id);
        } else {
            this.connections.set(user.id, this.sockets);
        }
        this.sockets = [];
        if (!this.connections.size) {
            this.connections.clear();
        }
    }

}