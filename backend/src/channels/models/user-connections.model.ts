import { Socket } from "socket.io";
import { User } from "src/users/entities/user.entity";

export class UserConnections extends User {

    connections: Map<number, Socket[]>;
}