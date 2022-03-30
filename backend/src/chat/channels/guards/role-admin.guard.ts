import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { Connection } from "typeorm";
import { UserChannel, UserRole } from "../entities/user-channel.entity";

@Injectable()
export class RoleAdminGuard implements CanActivate {
    constructor(private connection: Connection) {}
    async canActivate(
        context: ExecutionContext
        ): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        const role =  await this.connection.getRepository(UserChannel).findOne({
            where: {
                user: Number(req.user.id),
                channel: Number(req.params.channelId),
            }
        });
        
        if (role.userRole !== UserRole.OWNER && role.userRole !== UserRole.ADMIN) {
            throw new HttpException('Forbidden: you are not a channel admin', 403)
        }
        return true;
    }
}