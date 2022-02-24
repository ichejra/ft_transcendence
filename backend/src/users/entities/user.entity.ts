import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm'
// import { UserFriendsEntity } from './user-friends.entity';

@Entity('user')
export class UserEntity {
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

    @ManyToMany(() => UserEntity, user => user.friends)
    @JoinTable()
    friends: UserEntity[];
}
