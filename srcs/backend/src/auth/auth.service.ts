import {
    ForbiddenException,
    Injectable
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { JwtPayload } from "./type/jwt-payload.type";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
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
            let url: string;
            if (user && user.is_2fa_enabled) {
                _res.cookie('key', user.id);
                url = this.configService.get('VERIFY_PAGE');
                return _res.redirect(url);
            }
            else if (!user) {
                user = await this.usersService.create(_req.user);
                url = this.configService.get('COMPLETE_INFO'); // redirect to complete-info page
            } else {
                url = this.configService.get('HOME_PAGE'); // redirect to Home page
            }
            const payload: JwtPayload = { id: user.id, user_name: user.user_name, email: user.email };
            const token = this.jwtService.sign(payload);
            _res.cookie('accessToken', token);
            return _res.redirect(url);
        } catch (err) {
            throw new ForbiddenException('Forbidden: user cannot log in');
        }
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
