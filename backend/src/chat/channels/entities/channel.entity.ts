import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn
} from "typeorm";

export enum ChannelType {
    PRIVATE = "private",
    PUBLIC = "public",
}

@Entity('channels')
export class Channel extends BaseEntity {

    constructor(name: string, type: ChannelType, password?: string) {
        super();
        this.name = name;
        this.type = type;
        this.password = password;
    }

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        type: 'varchar',
        length: 255,
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
    type?: ChannelType;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt?: Date;
}