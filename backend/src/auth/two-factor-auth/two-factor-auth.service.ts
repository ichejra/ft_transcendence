import {
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import * as dotenv from "dotenv";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entities/user.entity";
import { JwtPayload } from "../type/jwt-payload.type";
import { ConfigService } from "@nestjs/config";
import { authenticator } from "otplib";
import { toDataURL } from "qrcode";
import { Response } from "express";

dotenv.config();
@Injectable()
export class TwoFactorAuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private configService: ConfigService,
    ) { }

    /* method used for changing 2fa bool */
    enableDisableTwoFactorAuth = async (userId: number, bool: boolean) => {
        return this.usersService.turnOnOffTwoFactorAuth(userId, bool);
    }

    //*  All the new change will be here
    //* code:
    generateTwoFactorAuthSecretAndQRCode = async (user: User, res: Response): Promise<any> => {
        const secret = authenticator.generateSecret();
        const otpauth = authenticator.keyuri(
            user.email,
            this.configService.get('APP_NAME'),
            secret
        );
        await this.usersService.setTwoFactorAuthSecret(user.id, secret);
        const dataUrl = await toDataURL(otpauth);
        return res.status(200).json(dataUrl);
    }

    verifyCode = async (user: User, code: string, res: Response): Promise<any> => {
        const isValid = authenticator.verify({
            token: code,
            secret: user.twoFactorAuthSecret,
        });
        if (!isValid) {
            res.clearCookie('accessToken');
            throw new UnauthorizedException('Invalid code.')
        }
        // const payload: JwtPayload = {
        //     id: user.id,
        //     user_name: user.user_name,
        //     email: user.email
        // };
        // const token: string = this.jwtService.sign(payload, {
        //     secret: this.configService.get('JWT_SECRET'),
        //     expiresIn: this.configService.get('JWT_EXPIRESIN'),
        // });
        // res.cookie('accessToken', token);
        return res.redirect(this.configService.get('HOME_PAGE'));// redirect to Home page
    }
    //* end
}