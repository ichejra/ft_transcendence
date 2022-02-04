import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Observable, from } from 'rxjs';
import { UserEntity } from '../models/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>
    ) {}

    insertUser(user: UserEntity): Observable<UserEntity> {
        return from(this.usersRepository.save(user));
    }

    getUsers(): Observable<UserEntity[]> {
        return from(this.usersRepository.find());
    }

    updateUser(id:number, user: UserEntity): Observable<UpdateResult> {
        return from(this.usersRepository.update(id, user));
    }
}
