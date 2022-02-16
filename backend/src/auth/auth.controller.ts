import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { IntraAuthGuard } from "./intra-auth.guard";

@Controller()
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @UseGuards(IntraAuthGuard)
    @Get('login')
    async login(@Req() req) {
        return req.user;
    }

    @UseGuards(IntraAuthGuard)
    @Get('auth')
    async loginRedirection(@Req() req) {
        return this.authService.signInWithIntra(req);
    }
}