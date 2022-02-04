import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user/user.controller';
import { UserEntity } from './models/user.entity';
import { UserService } from './services/user.service';

@Module({
    imports: [ TypeOrmModule.forFeature([ UserEntity ]) ],
    providers: [ UserService ],
    controllers: [ UserController ],
})
export class UserModule {}
