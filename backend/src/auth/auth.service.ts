import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { TwoFactorAuthService } from "./two-factor-auth/two-factor-auth.service";
import { JwtPayload } from "./type/jwt-payload.type";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private twoFactorAuthService: TwoFactorAuthService
        ) {}
    
    /* an async function  used for validate the user if exist in database */
    async validateUser(payload: JwtPayload): Promise<User> {
        const { id } = payload;
        const user = await this.usersService.findOne( Number(id) );
        if (!user) {
            return null;
        }
        return user;
    }

    /* function used for creating the user if not exist and sign it */
    async login(_req: any, _res: any): Promise<any> {
        let user : User = null;
        let url: string;
        try {
            user = await this.usersService.findOne(Number(_req.user.id));
            // 2FA ENABLE
            if (user && user.is_2fa_enabled === true) {
                await this.twoFactorAuthService.sendConnectLink(user);
                return _res.redirect(process.env.HOME_PAGE);
            }
            if (!user) {
                user = await this.usersService.create(_req.user);
                url = process.env.COMPLETE_INFO; // redirect to complete-info page
            } else {
                url = process.env.HOME_PAGE; // redirect to Home page
            }
        } catch(err) {
            // ! error handling
            console.log(err);
        }
        const payload: JwtPayload = { id: user.id ,user_name: user.user_name, email: user.email};
        const jwtToken = this.jwtService.sign(payload);
        _res.cookie('accessToken', jwtToken);
        return  _res.redirect(url);
    }

    async logout(_req: any, _res: any): Promise<any> {
        const user = await this.usersService.findOne(Number(_req.user.id));
        if (user && _res.cookie('accessToken')) {
            _res.clearCookie('accessToken');
        }
        return _res.redirect(process.env.HOME_PAGE);
    }

    getUserFromToken = async (token: string): Promise<User> => {
        const payload: JwtPayload = this.jwtService.verify(token, { 
            secret: process.env.JWT_SECRET,
        });
        if (payload.id) {
            return await this.usersService.findOne(Number(payload.id));
        }
        return null;
    }
}
