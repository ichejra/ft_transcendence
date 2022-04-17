import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";
import { TwoFactorAuthController } from "./two-factor-auth.controller";
import { TwoFactorAuthService } from "./two-factor-auth.service";

@Module({
    imports: [
        JwtModule.register({}),
        UsersModule,
    ],
    controllers: [TwoFactorAuthController],
    providers: [
        TwoFactorAuthService,
    ],
})
export class TwoFactorAuthModule { }