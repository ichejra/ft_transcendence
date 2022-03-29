import { Controller, Get, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { IntraAuthGuard } from "./guards/intra-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    /* Route: OAuth42 
        http://${host}:${port}/auth/
    */
    @Get()
    @HttpCode(200)
    @UseGuards(IntraAuthGuard)
    login(@Req() _req: any, @Res() _res: any): Promise<any> {
        return this.authService.login(_req, _res);
    }

    /* Route: get the user who logged in 
        http://${host}:${port}/auth/profile
    */
    @Get('/profile')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() _req: any): Promise<any> {
        return _req.user;
    }

    /* Route: logout the user 
        http://${host}:${port}/auth/Logout
        -> clear user session
    */
    @Get('/logout')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    logout(@Req() _req: any, @Res() _res: any): Promise<any> {
        return this.authService.logout(_req, _res);
    }

}