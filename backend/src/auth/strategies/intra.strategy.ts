import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-42';
import { UserDto } from "src/users/dto/user.dto";
import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {

    constructor() {
        super({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.SECRET,
            callbackURL: process.env.CALLBACK_URL,
            profileFields: {
                'id': function (obj: any) { return String(obj.id); },
                'username': 'login',
                'displayName': 'displayname',
                'name.familyName': 'last_name',
                'name.givenName': 'first_name',
                'profileUrl': 'url',
                'emails.0.value': 'email',
                'phoneNumbers.0.value': 'phone',
                'photos.0.value': 'image_url'
            }
        }); // Config
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
        const { id, emails, photos, displayName } = profile;
        const user: UserDto = {
            id: id,
            email: emails[0].value,
            display_name: displayName,
            avatar_url: photos[0].value,
        }
        done(null, user);
    }

}