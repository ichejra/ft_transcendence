import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ChannelType } from "../entities/channel.entity";

// add the validation
export class ChannelDto {

    @IsString()
    @IsNotEmpty()
    name?: string;

    password?: string;

    @IsEnum(ChannelType)
    @IsNotEmpty()
    type?: ChannelType;
}