import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('channels')
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "", unique: true })
    name: string;

    @Column()
    password?: string;

    @Column({ default: false})
    type: boolean;
}