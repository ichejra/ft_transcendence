import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Connection } from "typeorm";
import { UserChannel, UserRole } from "../entities/user-channel.entity";

@Injectable()
export class RoleOwnerGuard implements CanActivate {
    constructor(private connection: Connection) {}
    async canActivate(
        context: ExecutionContext
        ): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        const role = await this.connection.getRepository(UserChannel).findOne({
            where: {
                user: Number(req.user.id),
                channel: Number(req.params.channelId),
                userRole: UserRole.OWNER
            }
        });
        if (role === undefined) {
            throw new HttpException("Forbidden: you do not have permissions", HttpStatus.FORBIDDEN);
        }
        return true;
    }
}