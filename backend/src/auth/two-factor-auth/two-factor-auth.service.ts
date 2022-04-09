import { HttpStatus, Injectable, Res } from "@nestjs/common";
import * as dotenv from "dotenv";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "src/mail/mail.service";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entities/user.entity";
import { JwtPayload } from "../type/jwt-payload.type";
import { ConfigService } from "@nestjs/config";

dotenv.config();
@Injectable()
export class TwoFactorAuthService {
    constructor(
        private readonly jwtService: JwtService,
        private mailService: MailService,
        private readonly usersService: UsersService,
        private configService: ConfigService,
    ) { }

    /* method used for changing 2fa bool */
    enableDisableTwoFactorAuth = async (userId: number, bool: boolean) => {
        return this.usersService.turnOnOffTwoFactorAuth(userId, bool);
    }

    /* method used for email sending */
    async sendConnectLink(user: User): Promise<any> {
        try {
            const payload: JwtPayload = { id: user.id, user_name: user.user_name, email: user.email };
            const token: string = this.jwtService.sign(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRESIN')
            });

            const url: string = `${this.configService.get('BACKEND_URL')}/api/2fa/verify?token=${token}`;
            const text = `Welcome to ${this.configService.get('APP_NAME')} 2FA. To continue, click here: ${url}`;

            await this.mailService.sendMail({
                to: user.email,
                subject: 'Account login',
                text
            });
            return { success: true, message: 'check inbox.' }
        } catch (err) {
            throw err;
        }
    }

    /* method used for logging verified */
    async verify(token: string, res: any): Promise<any> {
        const { id, email } = await this.jwtService.verify(token);
        const user = await this.usersService.findOne(Number(id));
        if (user && user.email === email) {
            res.cookie('accessToken', token);
            return res.redirect(this.configService.get('HOME_PAGE'));// redirect to Home page
        } else {
            return res.status(HttpStatus.UNAUTHORIZED).json({ succes: false, msg: 'UNAUTHORIZED' }).send();// redirect to the error page
        }
    }
}