import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsString, IsUrl } from "class-validator";
import { UserStatus } from "../entities/user.entity";

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
        enum: UserStatus
    })
    status?: UserStatus;

    @IsUrl()
    @IsNotEmpty()
    avatar_url?: string;
}
