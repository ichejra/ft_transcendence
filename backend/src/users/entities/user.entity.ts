import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn({ type: "int" })
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
}