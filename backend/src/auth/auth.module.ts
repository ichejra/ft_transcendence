import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IntraStrategy } from './intra.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [ UsersModule, PassportModule, JwtModule.register({
        secret: process.env.SECRETKEY,
        signOptions: {
            expiresIn: process.env.EXPIRESIN,
        }
    }) ],
    controllers: [AuthController ],
    providers: [ AuthService, IntraStrategy, JwtStrategy ]
})
export class AuthModule {}