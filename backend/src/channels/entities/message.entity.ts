import { User } from "src/users/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('messages')
export class Message extends BaseEntity {
    
    constructor(author: User, content: string) {
        super();
        this.author = author;
        this.content = content;
    }
    
    @PrimaryGeneratedColumn()
    id: number;

    
    @ManyToOne(() => User, (e: User) => e.messages, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({name: 'authorId'})
    author: User;

    @Column({
        type: 'varchar',
        nullable: false
    })
    content: string;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
}