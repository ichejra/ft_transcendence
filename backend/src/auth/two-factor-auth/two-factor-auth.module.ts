import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MailModule } from "src/mail/mail.module";
import { MailService } from "src/mail/mail.service";
import { UsersModule } from "src/users/users.module";
import { AuthModule } from "../auth.module";
import { TwoFactorAuthController } from "./two-factor-auth.controller";
import { TwoFactorAuthService } from "./two-factor-auth.service";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRESIN }
        }),
        UsersModule,
        MailModule,
    ],
    controllers: [TwoFactorAuthController],
    providers: [
        TwoFactorAuthService,
        MailService
    ],
})
export class TwoFactorAuthModule { }