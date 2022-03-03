import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { use } from "passport";
import { UserDto } from "src/users/dto/user.dto";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { JwtPayload } from "./jwt.strategy";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
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
        let user : UserDto = null;
        let url: string;
        try {
            user = await this.usersService.findOne(Number(_req.user.id));
            if (!user) {
                user = await this.usersService.create(_req.user);
                url = process.env.COMPLETE_INFO; // redirect to complete-info page
            }else{
                url = process.env.HOME_PAGE; // redirect to Home page
            }
        } catch(err) { }
        const payload: JwtPayload = { id: (await user).id ,user_name: (await user).user_name, email: (await user).email};
        const jwtToken  = await this.jwtService.sign(payload);
        _res.cookie('user', JSON.stringify(user));
        _res.cookie('jwt', jwtToken);
        return  _res.redirect(url);
    }

    async logout(_req: any, _res: any): Promise<any> {
        const user = await this.usersService.findOne(Number(_req.user.id));
        if (user && _res.cookie('jwt')) {
            _res.clearCookie('jwt');
        }
        return _res.redirect(process.env.HOME_PAGE);
    }
}
