import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('channel')
export class ChannelEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "", unique: true })
    name: string;

    @Column()
    password?: string;

    @Column({ default: false})
    type: boolean;
}