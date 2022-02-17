import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, verifyCallback } from 'passport-42';
import { UserDto } from "src/users/dto/user.dto";
import { AuthService } from "./auth.service";

const starategyOptions = {
    clientID: process.env.UID,
    clientSecret: process.env.SECRET,
    callbackURL: "http://localhost:3000/auth",
    // profileFields: {
    //     'id': function (obj) { return String(obj.id); },
    //     'username': 'login',
    //     'displayName': 'displayname',
    //     'name.familyName': 'last_name',
    //     'name.givenName': 'first_name',
    //     'profileUrl': 'url',
    //     'emails.0.value': 'email',
    //     'phoneNumbers.0.value': 'phone',
    //     'photos.0.value': 'image_url'
    //   }
}

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {

    constructor(private authService: AuthService) {
        super(starategyOptions); // Config
    }
    
    async validate(accessToken: string, refreshToken: string, profile: any, done: Function) : Promise<any> {
        console.log(profile);
        const { name, username, emails, photos, displayName } = profile;
        return  {
            user_name: username,
            email: emails[0].value,
            display_name: displayName,
            avatar_url: photos[0].value,
            is_active: false,
            state: false,
        }
    }

}