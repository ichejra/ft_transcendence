import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";

export enum ChannelType {
    PRIVATE = "private",
    PUBLIC = "public",
}

@Entity('channels')
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 255,
        default: '',
        unique: true
     })
    name: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    password?: string;
 
    @Column({
        type: "enum",
        enum: ChannelType,
        default: ChannelType.PUBLIC,
    })
    type: ChannelType;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
}