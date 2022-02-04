import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UpdateResult } from 'typeorm';
import { UserEntity } from 'src/users/models/user.entity';
import { UserService } from 'src/users/services/user.service';


@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    create(@Body() user: UserEntity): Observable<UserEntity> {
        return this.userService.insertUser(user);
    }

    @Get()
    getAllUsers(): Observable<UserEntity[]> {
        return this.userService.getUsers();
    }

    @Patch(':id')
    updateUser(@Param() id: number, @Body() user: UserEntity): Observable<UpdateResult> {
        return this.userService.updateUser(id, user);
    }

}
