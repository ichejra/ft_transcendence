import { UserEntity } from "src/users/entities/user.entity";
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChannelEntity } from "./channel.entity";

@Entity('user_channel') 
export class UserChannelEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => UserEntity)
    @JoinColumn()
    user?: number;

    @OneToOne(() => ChannelEntity,)
    @JoinColumn()
    channel?: number;
}
