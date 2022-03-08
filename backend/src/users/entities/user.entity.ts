import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, PrimaryColumn, CreateDateColumn } from 'typeorm'
import { UserFriends } from './user-friends.entity';

export enum UserStatus {
    ONLINE = "online",
    OFFLINE = "offline",
    IN_GAME = "in_game"
} 

@Entity('users')
export class User {
    @PrimaryColumn({ type: "int" })
    id: number;

    @Column({ default: '', unique: true })
    user_name: string;

    @Column({default: '', unique: true })
    email: string;

    @Column({default: '', unique: true })
    display_name: string;

    @Column({default: ''})
    avatar_url: string;

    @Column({ default:false })
    is_2fa_enabled: boolean;

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.OFFLINE
    })
    status: UserStatus;

    @OneToMany(() => UserFriends, (e: UserFriends) => e.applicant)
    sentRequestFriends: UserFriends[];

    @OneToMany(() => UserFriends, (e: UserFriends) => e.recipient)
    recievedFriendRequest: UserFriends[];

    @CreateDateColumn()
    created_at: Date;
}
