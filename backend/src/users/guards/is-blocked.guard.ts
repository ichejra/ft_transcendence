import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { ForbiddenException } from "src/exceptions/forbidden.exception";
import { Connection } from "typeorm";
import { UserFriends, UserFriendsRelation } from "../entities/user-friends.entity";

@Injectable()
export class IsBlockedGuard implements CanActivate {
    constructor(private connection: Connection) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const _req = context.switchToHttp().getRequest();
        const relation = await this.connection.getRepository(UserFriends).findOne({
            where: [ {
                applicant: Number(_req.user.id),
                recipient: Number(_req.params.userId),
            }, {
                applicant: Number(_req.params.userId),
                recipient: Number(_req.user.id)
            }]
        });
        if (relation !== undefined && relation.status === UserFriendsRelation.BLOCKED){
            throw new ForbiddenException('Forbidden: cannot reach the resouce');
        }
        return true;
    }
}