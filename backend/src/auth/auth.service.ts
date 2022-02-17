import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "src/users/dto/user.dto";
import { UsersService } from "src/users/users.service";
import { JwtPayload } from "./jwt.strategy";


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
        ) {}
    
    async validateUser(payload: JwtPayload): Promise<UserDto> {
        const { user_name, email } = payload;
        const user = await this.usersService.findOne({ user_name});
        if (!user) {
            return null;
        }
        return user;
    }

    async login(userdto: UserDto): Promise<any> {
        // console.log(userdto);
        // check for user
        let user : UserDto = null;
        try {
            user = await this.usersService.findOne({ user_name: userdto.user_name });
        } catch(err) {
            user = await this.usersService.create(userdto);
        }
        const payload: JwtPayload = { user_name: (await user).user_name, email: (await user).email };
        const accessToken  = this.jwtService.sign(payload);
        return {
            expiresIn : process.env.EXPIRESIN,
            accessToken
        }
    }
    // async logInWithIntra(data) {
    //     if (!data.user) {
    //         throw new BadRequestException();
    //     }
    //     try {
    //         let user = await this.usersService.findOne(data.user.username);
    //         if (user) throw 'found';
    //     } catch (e) {
    //         if (e === 'found') {
    //             throw new ForbiddenException({
    //                 status: 403,
    //                 error: 'Forbidden: user already exists.'
    //             });
    //         }
    //     }
    //     try {
    //         return await this.usersService.create(data.user);
    //     }
    //     catch (exp) {
    //         throw exp;
    //     }
    // }
}
