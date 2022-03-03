import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, PrimaryColumn } from 'typeorm'
import { UserFriends } from './user-friends.entity';

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

    @Column({default: false})
    is_active: boolean;

    @Column({default: false})
    state: boolean;

    @OneToMany(() => UserFriends, (e: UserFriends) => e.applicant)
    sentRequestFriends: UserFriends[];

    @OneToMany(() => UserFriends, (e: UserFriends) => e.recipient)
    recievedFriendRequest: UserFriends[];
}
