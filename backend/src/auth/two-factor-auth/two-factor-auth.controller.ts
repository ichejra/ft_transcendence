import {
    Body,
    Controller,
    Get,
    HttpCode,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UseGuards
} from "@nestjs/common";
import { Response } from "express";
import { ReqUser } from "src/users/decorators/req-user.decorator";
import { User } from "src/users/entities/user.entity";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { TwoFactorAuthService } from "./two-factor-auth.service";

@Controller('2fa')
export class TwoFactorAuthController {
    constructor(
        private readonly twoFactorAuthService: TwoFactorAuthService,
    ) { }

    @Get('enable')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    enableTwoFactorAuth(@ReqUser() user: User) {
        return this.twoFactorAuthService.enableDisableTwoFactorAuth(Number(user.id), true);
    }

    @Get('disable')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    disableTwoFactorAuth(@ReqUser() user: User) {
        return this.twoFactorAuthService.enableDisableTwoFactorAuth(Number(user.id), false);

    }

    @Get('generate')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    sendEmail(
        @ReqUser() user: User,
        @Res() res: Response): Promise<any> {
        return this.twoFactorAuthService.generateTwoFactorAuthSecretAndQRCode(user, res);
    }

    @Post('verify')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    verifyLogin(
        @ReqUser() user: User,
        @Res() res: Response,
        @Body('code') code: string
    ): Promise<any> {
        return this.twoFactorAuthService.verifyCode(user, code, res);
    }
} 