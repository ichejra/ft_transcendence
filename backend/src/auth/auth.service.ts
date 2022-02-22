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
        const { id } = payload;
        const user = await this.usersService.findOne({ id: id });
        if (!user) {
            return null;
        }
        return user;
    }

    async login(_req: any, _res: any): Promise<any> {
        let user : UserDto = null;
        let url: string;
        try {
            user = await this.usersService.findOne({ user_name: _req.user.user_name });
            url = 'http://localhost:3001/'; // redirect to Home page
        } catch(err) {
            user = await this.usersService.create(_req.user);
            url = 'http://localhost:3001/#/complete-info'; // redirect to complete-info page
        }
        
        const payload: JwtPayload = { id: (await user).id ,user_name: (await user).user_name, email: (await user).email};
        const accessToken  = this.jwtService.sign(payload);
        _res.cookie('user', JSON.stringify(user));
        _res.cookie('jwt', accessToken);
        return  url;
    }
}
