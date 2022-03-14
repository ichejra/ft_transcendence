import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { ChannelDto } from "./dto/channel.dto";
import { UpdateChannelDto } from "./dto/update-channel.dto";
import { Channel } from "./entities/channel.entity";
import { MemberStatus, UserChannel, UserRole } from "./entities/user-channel.entity";

@Injectable()
export class ChannelsService {
    constructor(
        @InjectRepository(Channel)
        private channelsRepository: Repository<Channel>,
        @InjectRepository(UserChannel)
        private userChannelRepository: Repository<UserChannel>
        ) {}
    /* Channels */
    /* Method: create a new channel in database */
    async createChannel(user: User, channel: ChannelDto) : Promise<Channel> {
        // save channel
        const channel_ = await this.channelsRepository.save(channel);
        // create relation between user and target channel
        await this.userChannelRepository.query(
            `INSERT INTO user_channel (
                userId,
                channelId,
                userRole,
            ) VALUE ($1, $2, $3)`,
            [ user.id, channel_.id, UserRole.OWNER ]
        );
        return channel_;
    }

    /* get a channel by id */
    async getChannelById(channelId: number): Promise<Channel> {
        return await this.channelsRepository.findOne(channelId);
    }

    /* get a channel by name */
    async getChannelByName(name: string): Promise<Channel> {
        return await this.channelsRepository.findOne(name);
    }

    /* update channel */
    async updateChannel(channelId: number, data: UpdateChannelDto): Promise<Channel> {
        return await this.channelsRepository.update(channelId, data).then( async () => { 
            return await this.channelsRepository.findOne(channelId);
        });
    }

    /* delete channel */
    async deleteChannel(channelId: number): Promise<any> {
        // check the user if he's the owner
        await this.userChannelRepository.query(
            `DELETE FROM user_channel
            WHERE "user_channel"."channelId" = $1`, [ channelId ]
        );
        return await this.channelsRepository.delete(channelId);
    }

    /* joining channel -> user_channel table updating */
    joinChannel = async (channelId: number, userId: number) : Promise<any> => {
        // user channel relation creation
        await this.userChannelRepository.query(
            `INSERT INTO user_channel (
                userId,
                channelId,
                userRole
            ) VALUE($1, $2, $3)`,
            [ userId, channelId, UserRole.MEMBER ]
        );
    }

    /* leave channel -> (if Owner then destroy channel) delete relation or banned the user */
    leaveChannel = async (channelId: number, userId: number) : Promise<any> => {
        // get user_channel relation
        const relation = await this.userChannelRepository.findOne({
            where: {
                user: userId,
                channel: channelId
            }
        });
        // user channel relation destroy
        await this.userChannelRepository.query(
            `DELETE FROM user_channel
            WHERE "user_channel"."channelId" = $1
            AND "user_channel"."userId" = $2`,
            [ channelId, userId ]
        );
        if (relation.userRole === UserRole.OWNER) { // Destroy channel
            await this.deleteChannel(channelId);
        }
    }

    /* Add admin to a channel */
    addAdmin = async (channelId: number, ownerId: number, userId: number): Promise<any> => {
        // check that the user is owner
        const userChannel = await this.userChannelRepository.findOne({
            where: {
                user: ownerId,
                channel: channelId
            }
        });
        if (userChannel.userRole === UserRole.OWNER) {
            // update the userRole of the new admin to the admin
            await this.userChannelRepository.query(
                `UPDATE user_channel
                SET "state" = $1
                WHERE "channelId" = $2
                AND "userId" = $3`,
                [ UserRole.ADMIN, channelId, userId ]  
            );
        }
    }

    /* Remove admin */
    removeAdmin = async (channelId: number, adminId: number, userId: number): Promise<any> => {
        // check that the user is owner
        const userChannel = await this.userChannelRepository.findOne({
            where: {
                user: adminId,
                channel: channelId,
                userRole: (UserRole.OWNER || UserRole.ADMIN)
            }
        });
        // update the userRole of the new admin to the admin
        if (userChannel) {
            await this.userChannelRepository.query(
                `UPDATE user_channel
                SET "state" = $1
                WHERE "channelId" = $2
                AND "userId" = $3`,
                [ UserRole.MEMBER, channelId, userId ]  
            );
        }
    }

    /* change user status at the channel */
    changeStatus = async (
        channelId: number,
        adminId: number,
        memberId: number,
        status: MemberStatus): Promise<any> => {
        
        const userChannel = await this.userChannelRepository.findOne({
            where: {
                user: adminId,
                channel: channelId,
                userRole: (UserRole.OWNER || UserRole.ADMIN)
            }
        });
        if (userChannel) {
            await this.userChannelRepository.query(
                `UPDATE user_channel
                SET "userStatus" = $1
                WHERE "channelId" = $2
                AND "userId" = $3`,
                [ status, channelId, memberId]
            );
        }
    }
}