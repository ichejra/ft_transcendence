import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export enum UserFriendsRelation {
    ACCEPTED = "accepted",
    PENDING = "pending",
    BLOCKED = "blocked"
}

@Entity('user_friends')
export class UserFriends {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (e: User) => e.sentRequestFriends, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'applicantId' })
    applicant: User;

    @ManyToOne(() => User, (e: User) => e.recievedFriendRequest, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'recipientId'})
    recipient: User;

    @Column({ type: 'enum', default: UserFriendsRelation.PENDING, enum: UserFriendsRelation  })
    status: UserFriendsRelation;
}