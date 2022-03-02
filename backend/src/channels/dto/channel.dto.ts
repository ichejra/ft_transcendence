import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ChannelType } from "../entities/channel.entity";

// add the validation
export class ChannelDto {
    @IsNumber()
    id?: number;

    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsString()
    password?: string;

    @IsEnum(ChannelType)
    @IsNotEmpty()
    type?: ChannelType;
}