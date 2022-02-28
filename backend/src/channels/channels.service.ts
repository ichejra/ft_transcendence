import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChannelDto } from "./dto/channel.dto";
import { Channel } from "./entities/channel.entity";

@Injectable()
export class ChannelsService {
    constructor(
        @InjectRepository(Channel)
        private channelsRepository: Repository<Channel>)
        {}

    async createChannel(channel: ChannelDto) : Promise<ChannelDto> {
        return await this.channelsRepository.save(channel);
    }
}