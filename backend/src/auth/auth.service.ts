import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, Users } from "@prisma/client";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async validateUser(where: Prisma.UsersWhereUniqueInput): Promise<any> {
        const user = await this.usersService.findOne(where);
        if (user) {
            const { user_name, ...rest} = user;
            return rest;
        }
        return null;
    }

    async signInWithIntra(data) {
        if (!data.user) {
            throw new BadRequestException();
        }
        try {
            let user = await this.usersService.findOne({ email: data.user.email });
            if (user) throw 'found';
        } catch (e) {
            if (e === 'found') {
                throw new ForbiddenException({
                    status: 403,
                    error: 'Forbidden: user already exists.'

                });
            }
        }
        try {
            return await this.usersService.create(data.user);
        }
        catch (exp) {
            throw exp;
        }
    }
}