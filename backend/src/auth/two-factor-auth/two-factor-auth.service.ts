import { Injectable, Res } from "@nestjs/common";
import * as dotenv from "dotenv";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "src/mail/mail.service";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entities/user.entity";
import { JwtPayload } from "../type/jwt-payload.type";

dotenv.config();
@Injectable()
export class TwoFactorAuthService {
    constructor(
        private readonly jwtService: JwtService,
        private mailService: MailService,
        private readonly usersService: UsersService
        ) {}
    
    /* method used for changing 2fa bool */
    enableDisableTwoFactorAuth = async (userId: number, bool: boolean) => {
        return this.usersService.turnOnTwoFactorAuthentication(userId, bool);
    }

    /* method used for email sending */
    async sendConnectLink(user: User) : Promise<any>{
        const payload: JwtPayload = { id: user.id, user_name: user.user_name, email: user.email};
        const token: string = await this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRESIN
        });

        const url: string = `http://${process.env.HOST}:${process.env.PORT}/2fa/verify?token=${token}`;
        const text = `Welcome to ${process.env.APP_NAME} 2FA. To continue, click here: ${url}`;

        return await this.mailService.sendMail({
            to: user.email,
            subject: 'Account login',
            text,
        }).then(() => {
            return { success: true, message: 'check inbox.'}
        })

    }

    /* method used for logging verified */
    async verify(token: string, res: any): Promise<any> {
        const { id, email } =  await this.jwtService.verify(token);
        const user = await this.usersService.findOne(Number(id));
        if (user && user.email === email) {
            res.cookie('accessToken', token);
            return res.redirect(process.env.HOME_PAGE);// redirect to Home page
        } else {
            return res.json({ succes: false, msg: 'UNAUTHORIZED' }).send();// redirect to the error page
        }
    }
}