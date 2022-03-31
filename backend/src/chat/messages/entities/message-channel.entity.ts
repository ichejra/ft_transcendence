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
import { Channel } from "../../channels/entities/channel.entity";

@Entity('messages_channels')
export class MessageChannel extends BaseEntity {
    
    constructor(author: User, channel: Channel, content: string) {
        super();
        this.author = author;
        this.channel = channel;
        this.content = content;
    }
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({name: 'authorId'})
    author: User;

    @ManyToOne(() => Channel, { onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'channelId'})
    channel: Channel;

    @Column({
        type: 'varchar',
        length: '200',
        nullable: false
    })
    content: string;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
}