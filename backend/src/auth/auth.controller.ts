import { BadRequestException, Controller, Get, HttpCode, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { IntraAuthGuard } from "./intra-auth.guard";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @Get()
    @HttpCode(200)
    @UseGuards(IntraAuthGuard)
    async login(@Req() _req, @Res() _res): Promise<any> {
        // console.log(_req.user);
        return await this.authService.login(_req, _res);
    }

    @Get('profile')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() _req): Promise<any> {
        return _req.user;
    }
}