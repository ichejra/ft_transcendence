import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity';
import * as dotenv from 'dotenv';
import { UserFriends } from './entities/user-friends.entity';

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forFeature([ User, UserFriends ]),
    MulterModule.register({
      dest: process.env.DESTINATION,
    })
],
  controllers: [ UsersController ],
  providers: [ UsersService ],
  exports: [ UsersService ]
})
export class UsersModule {}
