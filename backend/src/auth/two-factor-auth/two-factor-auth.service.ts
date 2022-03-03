import { Injectable, Res } from "@nestjs/common";
import * as dotenv from "dotenv";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "src/mail/mail.service";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entities/user.entity";

dotenv.config();
@Injectable()
export class TwoFactorAuthService {
    constructor(
        private readonly jwtService: JwtService,
        private mailService: MailService,
        private readonly usersService: UsersService
        ) {}

    async sendVerifaicationLink(user: User) : Promise<any>{
        const {id, email} = user;
        const payload = { id, email };
        const token: string = await this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRESIN
        });

        const url: string = `http://${process.env.HOST}:${process.env.PORT}/2fa/verify?token=${token}`;
        const text = `Welcome to ${process.env.APP_NAME}. To verify your accout, click here: ${url}`;

        await this.mailService.sendMail({
            to: email,
            subject: 'Account verification',
            text,
        });
    }

    async verify(token :string, res: any): Promise<any> {
        const {id, email } =  await this.jwtService.verify(token);
        const user = this.usersService.findOne(email);
        if (user) {
            await this.usersService.turnOnTwoFactorAuthentication(id);
            return res.redirect('http://localhost:3001/');
        }
        else {
            return res.redirect('http://localhost:3001/error');
        }
    }
}