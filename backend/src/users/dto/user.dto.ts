import { IsBoolean, IsEmail, IsNotEmpty, IsNumberString, IsString, IsUrl } from "class-validator";

export class UserDto {
    @IsNumberString()
    id?: number;

    @IsNotEmpty()
    user_name?: string;

    @IsEmail()
    email?: string;

    @IsString()
    display_name?: string;

    @IsBoolean()
    active_2fa?: boolean;

    @IsBoolean()
    state?: boolean;

    @IsUrl()
    avatar_url?: string;
}
