import { ConsoleLogger, Controller, Get, HttpCode, Patch, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
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
    enableTwoFactorAuth(@Req() _req: any) {
        return this.twoFactorAuthService.enableDisableTwoFactorAuth(Number(_req.user.id), true);
    }

    @Get('disable')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    disableTwoFactorAuth(@Req() _req: any) {
        return this.twoFactorAuthService.enableDisableTwoFactorAuth(Number(_req.user.id), false);

    }

    @Get('send-email')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    sendEmail(@Req() _req: any) {
        return this.twoFactorAuthService.sendConnectLink(_req.user);
    }

    @Get('verify')
    @HttpCode(200)
    verifyLogin(@Res() res: Response, @Query('token') token: string): Promise<any> {
        return this.twoFactorAuthService.verify(token, res);
    }
} 