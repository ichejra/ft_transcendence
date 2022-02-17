import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class IntraAuthGuard extends AuthGuard('42') {
    
    handleRequest(err, user, info) {
        if (err || !user) {
          return null;
        }
        return user;
      }
}