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
        private readonly usersService: UsersService,
        ){}
        
    private readonly authService: AuthService
    private readonly userConnections: UserConnections;
    
    /* function for getting user from socket by access token */
    async getUserFromSocket(socket: Socket): Promise<User> {
        const cookie = socket.handshake.headers.cookie;
        const { accessToken } = parse(cookie);
        const user = await this.authService.getUserFromToken(accessToken);
        if (!user) {
            throw new WsException('Invalid token.');
        }
        return user;
    }
    
    // save user connections
    addConnection = async (socket: Socket): Promise<any> => {
        const { id } = await this.getUserFromSocket(socket);
        const key = this.userConnections.connections.get(id);
        let sockets: Socket[] = [];
        if (!key) {  // client log in first connection
            sockets.push(socket);
            this.userConnections.connections.set(id, sockets);
            await this.usersService.updateState(Number(id), UserState.ONLINE);
        } else { // client create new connection
            sockets = this.userConnections.connections.get(id);
            sockets.push(socket);
            this.userConnections.connections[id] = sockets;
        }
    }

    // this function use for deleting the connection from connections array
    eraseConnection = async (socket: Socket): Promise<any> => {
        const { id } = await this.getUserFromSocket(socket);
        let sockets: Socket[] = this.userConnections.connections.get(id);
        sockets.filter((sock) => { return socket.id !== sock.id });
        if (!sockets.length) { // if sockets array empty that mean the client disconnected 
            this.userConnections.connections.delete(id);
            await this.usersService.updateState(Number(id), UserState.OFFLINE);
        }
        if (!this.userConnections.connections.size) {
            this.userConnections.connections.clear();
        }

    }

}