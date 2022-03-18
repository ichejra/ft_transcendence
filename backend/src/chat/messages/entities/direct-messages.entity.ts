import { User } from "src/users/entities/user.entity";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity('direct_messages')
export class DirectMessage extends BaseEntity {
    constructor(sender: User, receiver: User) {
        super();
        this.sender = sender;
        this.receiver = receiver;
    }

    @PrimaryGeneratedColumn()
    id?: number

    @ManyToOne(() => User)
    @JoinColumn({name: 'senderId'})
    sender?: User;

    @ManyToOne(() => User)
    @JoinColumn({name: 'receiverId'})
    receiver?: User;

    @Column({
        type: 'varchar',
        nullable: false
    })
    content: string;

    @CreateDateColumn()
    createdAt?: Date
}