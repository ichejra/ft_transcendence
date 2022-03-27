import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
    IsUrl
} from "class-validator";
import { UserState } from "../entities/user.entity";

export class UserDto {
    @IsNumber()
    id?: number;

    @IsString()
    @IsNotEmpty()
    user_name?: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email?: string;

    @IsString()
    display_name?: string;

    @IsEnum({
        enum: UserState
    })
    state?: UserState;

    @IsUrl()
    @IsNotEmpty()
    avatar_url?: string;
}
