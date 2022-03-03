import { Controller, Get, HttpCode, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { UsersService } from "src/users/users.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { TwoFactorAuthService } from "./two-factor-auth.service";

@Controller('2fa')
export class TwoFactorAuthController {
    constructor(
        private readonly twoFactorAuthService: TwoFactorAuthService,
        ) {}
    
    @Get('/send-email')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    sendVerification(@Req()_req: any) {
        this.twoFactorAuthService.sendVerifaicationLink(_req.user);
    }
    
    @Get('verify')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    verifyAccount(@Req() _req: any, @Res() res: Response, @Query('token') token: string): Promise<any> {
      return this.twoFactorAuthService.verify(token, res)
    }
} 