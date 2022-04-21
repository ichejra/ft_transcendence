import { User } from "src/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Channel } from "./channel.entity";

export enum UserRole {
    ADMIN = "admin",
    OWNER = "owner",
    MEMBER = "member",
};

export enum MemberStatus {
    ACTIVED = "actived",
    BANNED = "banned",
    MUTED = "muted",
};

@Entity('user_channel')
export class UserChannel {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user?: User;

    @ManyToOne(() => Channel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'channelId' })
    channel?: Channel;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.OWNER
    })
    userRole?: UserRole;

    @Column({
        type: "enum",
        enum: MemberStatus,
        default: MemberStatus.ACTIVED,
    })
    userStatus?: MemberStatus;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt?: Date;
};
