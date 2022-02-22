import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IntraStrategy } from './intra.strategy';
import { JwtStrategy } from './jwt.strategy';
import * as dotenv from 'dotenv';

dotenv.config()

@Module({
    imports: [ UsersModule, PassportModule, JwtModule.register({
        secret: process.env.JWT_SECRET ,
        signOptions: { expiresIn: process.env.JWT_EXPIRESIN}
    })],
    controllers: [AuthController ],
    providers: [ AuthService, IntraStrategy, JwtStrategy ]
})
export class AuthModule {}