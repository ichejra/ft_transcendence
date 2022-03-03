import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChannelDto } from "./dto/channel.dto";
import { UpdateChannelDto } from "./dto/update-channel.dto";
import { Channel } from "./entities/channel.entity";

@Injectable()
export class ChannelsService {
    constructor(
        @InjectRepository(Channel)
        private channelsRepository: Repository<Channel>)
        {}

    /* Method: create a new channel in database */
    async createChannel(channel: ChannelDto) : Promise<Channel> {
        return await this.channelsRepository.save(channel);
    }

    /* get a channel by id */
    async getChannelById(channelId: number): Promise<Channel> {
        return await this.channelsRepository.findOne(channelId);
    }

    /* update channel */
    async updateChannel(channelId: number, data: UpdateChannelDto): Promise<Channel> {
        return await (await this.channelsRepository.update(channelId, data)).raw;
    }

    /* delete channel */
    async deleteChannel(channelId: number): Promise<any> {
        return this.channelsRepository.delete(channelId);
    }


    /* */
}