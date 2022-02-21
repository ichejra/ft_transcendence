import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
    })
],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [ UsersService ]
})
export class UsersModule {}
