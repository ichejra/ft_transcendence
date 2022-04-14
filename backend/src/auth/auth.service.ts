import {
    ForbiddenException,
    Injectable
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
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
        private twoFactorAuthService: TwoFactorAuthService,
        private configService: ConfigService
    ) { }

    /* an async function  used for validate the user if exist in database */
    async validateUser(payload: JwtPayload): Promise<User> {
        const { id } = payload;
        try {
            const user = await this.usersService.findOne(Number(id));
            if (!user) {
                return null;
            }
            return user;
        } catch {
            return null;
        }
    }

    /* function used for creating the user if not exist and sign it */
    async login(_req: any, _res: any): Promise<any> {
        try {
            let user = await this.usersService.findOne(Number(_req.user.id));
            // 2FA ENABLE
            if (user && user.is_2fa_enabled) {
                return await this.twoFactorAuthService.generateTwoFactorAuthSecretAndQRCode(user, _res);
            }
            let url: string;
            if (!user) {
                user = await this.usersService.create(_req.user);
                url = this.configService.get('COMPLETE_INFO'); // redirect to complete-info page
            } else {
                url = this.configService.get('HOME_PAGE'); // redirect to Home page
            }
            const payload: JwtPayload = { id: user.id, user_name: user.user_name, email: user.email };
            const jwtToken = this.jwtService.sign(payload);
            _res.cookie('accessToken', jwtToken);
            return _res.redirect(url);
        } catch (err) {
            throw new ForbiddenException('Forbidden: user cannot log in');
        }
    }

    async logout(_req: any, _res: any): Promise<any> {
        const user = await this.usersService.findOne(Number(_req.user.id));
        if (user && _res.cookie('accessToken')) {
            _res.clearCookie('accessToken');
        }
        return _res.redirect(this.configService.get('HOME_PAGE'));
    }

    getUserFromToken = async (token: string): Promise<User> => {
        try {
            const payload: JwtPayload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            if (payload.id) {
                return await this.usersService.findOne(Number(payload.id));
            }
            return null;
        } catch (err) {
            return null;
        }
    }
}
