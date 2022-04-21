import {
    Entity,
    Column,
    OneToMany,
    PrimaryColumn,
    CreateDateColumn
} from 'typeorm'
import { UserFriends } from './user-friends.entity';

export enum UserState {
    ONLINE = "online",
    OFFLINE = "offline",
    IN_GAME = "in_game"
}

@Entity('users')
export class User {
    @PrimaryColumn({ type: "int" })
    id: number;

    @Column({
        type: 'varchar',
        length: 12,
        default: '',
        unique: true
    })
    user_name: string;

    @Column({
        type: 'varchar',
        length: 100,
        default: '',
        unique: true
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 20,
        default: '',
        unique: true
    })
    display_name: string;

    @Column({ default: '' })
    avatar_url: string;

    @Column({ default: false })
    is_2fa_enabled: boolean;

    @Column({ nullable: true })
    twoFactorAuthSecret?: string;

    @Column({
        type: 'enum',
        enum: UserState,
        default: UserState.OFFLINE
    })
    state: UserState;

    @OneToMany(() => UserFriends, (e: UserFriends) => e.applicant)
    sentRequestFriends: UserFriends[];

    @OneToMany(() => UserFriends, (e: UserFriends) => e.recipient)
    recievedFriendRequest: UserFriends[];

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
}
