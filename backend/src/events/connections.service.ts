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

    // save the users connections in Map
    private readonly connections: Map<number, Set<Socket>> = new Map<number, Set<Socket>>();
    
    /* function for getting user from socket by access token */
    public async getUserFromSocket(socket: Socket): Promise<User> {
        const accessToken = socket.handshake.auth.token;
        if (!accessToken) {
            throw new WsException('unauthorized: unauthenticated connection');
        }
        const user = await this.authService.getUserFromToken(accessToken);
        if (!user) {
            throw new WsException('unauthorized: invalid token.');
        }
        return user;
    }
    
    // save user connections
    public addConnection = async (socket: Socket): Promise<any> => {
        let user: User = null;
        try {
            user = await this.getUserFromSocket(socket);
        } catch(e) {
            socket.disconnect();
            throw new WsException('unauthorized: unauthenticated connection');

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

    // this function use for deleting the connection from connections array
    public eraseConnection = async (socket: Socket): Promise<any> => {
       let user: User;
        try {
            user = await this.getUserFromSocket(socket);
        } catch(e) {
            socket.disconnect(); // if the socket not authenticated should disconnect it
            throw new WsException('unauthorized: unauthenticated connection');
        }
        try {

            const sockets: Set<Socket> = this.connections.get(user.id);
            if (sockets) {
                if (sockets.size === 0){
                    await this.usersService.updateState(Number(user.id), UserState.OFFLINE);
                    this.connections.delete(user.id);
                } else {
                    this.connections[user.id] = sockets;
                }
            }
            return { success: true };
        } catch {
            socket.disconnect();
            throw new WsException('the user cannot connect');
        }
    }

    // Getting a all user connections
    public getUserConnections = async (userId: number) : Promise<Set<Socket>> => {
        try {
            const sockets = this.connections.get(userId);
             if (!sockets) throw new WsException('user had no connection');
            return sockets;
        } catch(err) {
            throw new WsException('the target user had no connection');
        }
    }

    // get receiver by id
    public getReceiverById = async (id: number) : Promise<User> => {
        try{
            return await this.usersService.findOne(id);
        } catch(err){
            throw new WsException('cannot get the receiver');
        }
    } 

}