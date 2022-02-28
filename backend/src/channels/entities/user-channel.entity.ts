import { User } from "src/users/entities/user.entity";
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./channel.entity";

@Entity('user_channel') 
export class UserChannel {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => User)
    @JoinColumn()
    user?: number;

    @OneToOne(() => Channel,)
    @JoinColumn()
    channel?: number;
}
