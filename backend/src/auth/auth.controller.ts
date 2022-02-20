import { BadRequestException, Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { IntraAuthGuard } from "./intra-auth.guard";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @Get()
    @UseGuards(IntraAuthGuard)
    async login(@Req() _req, @Res() _res): Promise<any> {
        const url = await this.authService.login(_req, _res);
        return _res.redirect(url);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() _req): Promise<any> {
        return _req.user;
    }
}