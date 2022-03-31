import { IsAlphanumeric, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ChannelType } from "../entities/channel.entity";

// add the validation
export class ChannelDto {

    @IsEnum(ChannelType)
    @IsNotEmpty()
    type?: ChannelType;

    @IsString()
    @IsNotEmpty()
    @IsAlphanumeric()
    name?: string;

    password?: string;
}