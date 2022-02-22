import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([ User ]),
    MulterModule.register({
      dest: './upload',
    })
],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [ UsersService ]
})
export class UsersModule {}
