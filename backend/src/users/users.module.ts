import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';

dotenv.config();
@Module({
  imports: [
    MulterModule.register({
      dest: process.env.DESTINATION,
    })
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
