import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsString, IsUrl } from "class-validator";

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

    @IsBoolean()
    active_2fa?: boolean;

    @IsBoolean()
    state?: boolean;

    @IsUrl()
    @IsNotEmpty()
    avatar_url?: string;
}
