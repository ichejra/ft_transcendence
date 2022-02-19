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
    async login(@Req() req: any, @Res() res: any) {
        console.log(req.user);
        const { accessToken } = await this.authService.login(req.user);
        res.cookie('jwt', accessToken).send({success: true});
        return {
            token: accessToken
        };
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req): Promise<any> {

        return req.user;
    }
}