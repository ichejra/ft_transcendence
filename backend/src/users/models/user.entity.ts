import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    first_name: string;

    @Column({ default: '' })
    last_name: string;

    @Column({ default: '' })
    email: string;

    @Column({ default: '' })
    gender: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createAt: Date;
}