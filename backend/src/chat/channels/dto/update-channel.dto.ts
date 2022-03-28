import { PartialType } from "@nestjs/mapped-types";
import { ChannelDto } from "./channel.dto";

export class UpdateChannelDto extends PartialType(ChannelDto) { }