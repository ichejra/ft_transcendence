import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IntraStrategy } from './strategies/intra.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import * as dotenv from 'dotenv';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';

dotenv.config()

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET ,
            signOptions: { expiresIn: process.env.JWT_EXPIRESIN }
        }),
        TwoFactorAuthModule,
    ],
    controllers: [ AuthController ],
    providers: [
        AuthService,
        IntraStrategy,
        JwtStrategy,
        TwoFactorAuthService,
        MailService
    ],
    exports: [ AuthService ]
})
export class AuthModule {}