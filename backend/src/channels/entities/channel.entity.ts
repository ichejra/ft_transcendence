import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum ChannelType {
    PRIVATE = "private",
    PUBLIC = "public",
}

@Entity('channels')
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "", unique: true })
    name: string;

    @Column()
    password?: string;

    @Column({
        type: "enum",
        enum: ChannelType,
        default: ChannelType.PUBLIC,
    })
    type: ChannelType;

    @CreateDateColumn()
    created_at: Date;
}