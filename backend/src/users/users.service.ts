import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'typeorm'

import { UserDto } from './dto/user.dto';
import {
  UserFriends,
  UserFriendsRelation
} from './entities/user-friends.entity';
import { User, UserState } from './entities/user.entity';
import * as fs from 'fs';
import * as ImageType from 'image-type';

@Injectable()
export class UsersService {
  constructor(
    private connection: Connection,
    private configService: ConfigService
  ) { }

  async create(user: UserDto): Promise<User> {
    try {
      return await this.connection.getRepository(User).save(user);
    } catch (e) {
      throw new ForbiddenException(`Forbidden: cannot create user.`);
    }
  }

  findAll(): Promise<User[]> {
    try {
      return this.connection.getRepository(User).find();
    } catch (err) {
      throw new NotFoundException(`Users not found`);
    }
  }

  async findOne(id: number | string): Promise<User> {
    try {
      const user = await this.connection.getRepository(User).findOne(id);
      if (!user) {
        return null;
      }
      return user;
    } catch (err) {
      return null;
    }
  }

  async updateProfile(id: number, user_name: string, file: Express.Multer.File): Promise<User> {
    try {
      const buffer = fs.readFileSync(`${file.destination}/${file.filename}`);
      if (!buffer || !ImageType(buffer)) {
        fs.unlinkSync(`${file.destination}/${file.filename}`);
        throw new ForbiddenException('invalid image.');
      }
      if (!file && user_name) {
        await this.connection.getRepository(User).update(id, { user_name: user_name });
      } else if (!user_name && file) {
        await this.connection.getRepository(User).update(id,
          { avatar_url: `${this.configService.get('BACKEND_URL')}/${file.filename}` }
        );
      } else if (file && user_name) {
        await this.connection.getRepository(User).update(id,
          {
            user_name: user_name,
            avatar_url: `${this.configService.get('BACKEND_URL')}/${file.filename}`
          });
      }
      const user = await this.connection.getRepository(User).findOne(id);
      if (user) {
        return user;
      }
      throw new NotFoundException('User not found.');
    } catch (err) {
      throw (err.statusCode) ? err : new ForbiddenException('Forbidden: cannot update the profile');
    }
  }

  // function used for updating user state
  updateState = async (id: number, state: UserState): Promise<User> => {
    try {

      await this.connection.getRepository(User).update(id, { state: state });
      const user = await this.connection.getRepository(User).findOne(id);
      if (user) {
        return user;
      }
      throw new NotFoundException('User not found.');
    } catch (err) {
      throw (err.statusCode) ? err : new ForbiddenException('Forbidden: cannot update the user state');
    }
  }

  async remove(id: number | string): Promise<any> {
    try {
      return await this.connection.getRepository(User).delete(id);
    }
    catch (e) {
      throw new NotFoundException('User not found.');
    }
  }

  async logout(_req: any, _res: any): Promise<any> {
    const user = await this.connection.getRepository(User).findOne(Number(_req.user.id));
    if (user) {
      _res.clearCookie('jwt');
    }
    _res.redirect(this.configService.get('HOME_PAGE'));
  }

  //* method used for insert the logged user id and requested user id in a database table("user_friends") with status pending until accept
  async insertToFriends(userId: any, recipientId: any): Promise<User> {
    try {
      const relation = await this.connection.getRepository(UserFriends).findOne({
        relations: ['applicant', 'recipient'],
        where: [{
          applicant: userId,
          recipient: recipientId,
        }, {
          applicant: recipientId,
          recipient: userId,
        }]
      })
      if (!relation) {
        await this.connection.getRepository(UserFriends).save({ applicant: userId, recipient: recipientId });
      }
      const user = await this.connection.getRepository(User).findOne({ where: { id: recipientId } });
      if (user) {
        return user;
      }
      throw new NotFoundException('User not found.');
    } catch (error) {
      throw error;
    }
  }

  //* method used for accept the request friend (applicantId) by update status in databases from pending to accepted
  async acceptFriend(userId, applicantId): Promise<User> {
    try {
      await this.connection.getRepository(UserFriends).query(
        `UPDATE user_friends
        SET  "status" = $1
        WHERE "recipientId" = $2
        AND "applicantId" = $3`,
        [
          UserFriendsRelation.ACCEPTED,
          userId,
          applicantId
        ]);
      const user = await this.connection.getRepository(User).findOne({ where: { id: applicantId } }); // return the accpeted friend
      if (user) {
        return user;
      }
      throw new NotFoundException('User not found.');
    } catch (error) {
      throw error;
    }
  }

  /* method used for block a friend 
    if the relation exist we update the status from pending or accpeted to blocked
    else if no relation we creating the relation and set the status to blocked
  */
  async blockFriend(userId: number, blockId: number): Promise<User> {
    try {
      const blocker = await this.connection.getRepository(User).findOne(userId);
      if (!blocker) {
        throw new NotFoundException('User not found.');
      }
      const blocked = await this.connection.getRepository(User).findOne(blockId);
      if (!blocked) {
        throw new NotFoundException('User not found');
      }
      const relation = await this.connection.getRepository(UserFriends).findOne({
        relations: ['applicant', 'recipient'],
        where: [{
          applicant: userId,
          recipient: blockId,
        }, {
          applicant: blockId,
          recipient: userId
        }]
      });
      if (!relation) {
        await this.connection.getRepository(UserFriends).save({
          applicant: blocker,
          recipient: blocked,
          status: UserFriendsRelation.BLOCKED
        });
      } else {
        await this.connection.getRepository(UserFriends).update(relation.id, {
          applicant: blocker,
          recipient: blocked,
          status: UserFriendsRelation.BLOCKED
        });
      }
      return blocked;
    } catch (error) {
      throw (error.statusCode) ? error : new ForbiddenException('cannot block the user');
    }
  }

  /* method used to unblock a user by update status to accepted or pending */ // this one might get some changes
  // delete the relation instead of updating the relation status
  async unblockFriend(userId: number, unblockId: number): Promise<User> {
    try {
      await this.connection.getRepository(UserFriends).query(
        `UPDATE user_friends
        SET "status" = $1
        WHERE ("recipientId" = $2 AND "applicantId" = $3)
        OR ("applicantId" = $2 AND "recipientId" = $3)`,
        [
          UserFriendsRelation.ACCEPTED,
          userId,
          unblockId
        ]);
      const user = await this.connection.getRepository(User).findOne({
        where: {
          id: unblockId
        }
      });
      if (user) {
        return user;
      }
      throw new NotFoundException('User not found.');
    } catch (error) {
      throw error;
    }
  }

  /* used for getting all the pending requests of the users  */
  async getPendingRequests(userId: number): Promise<User[]> {
    try {
      return await this.connection.getRepository(UserFriends).query(
        `SELECT * FROM users
        WHERE "users"."id"
        IN (SELECT "applicantId" FROM user_friends WHERE "user_friends"."recipientId" = $1 AND "user_friends"."status" = $2)`,
        [
          userId,
          UserFriendsRelation.PENDING
        ]);
    } catch (error) {
      throw error;
    }
  }


  /* used for getting the friends */
  async getUserFriends(userId: number): Promise<User[]> {
    try {
      return await this.connection.getRepository(UserFriends).query(
        `SELECT * FROM users
        WHERE "users"."id"
        IN (SELECT "recipientId" FROM user_friends WHERE "user_friends"."applicantId" = $1 AND "user_friends"."status" = $2)
        OR "users"."id"
        IN (SELECT "applicantId" FROM user_friends WHERE "user_friends"."recipientId" = $1 AND "user_friends"."status" = $2)`,
        [
          userId,
          UserFriendsRelation.ACCEPTED
        ]);
    } catch (error) {
      throw error;
    }
  }

  /* used for getting the blocked users */
  async getBlockedFriends(userId: number): Promise<User[]> {
    try {
      return await this.connection.getRepository(UserFriends).query(
        `SELECT * FROM users
        WHERE "users"."id"
        IN (SELECT "recipientId" FROM user_friends WHERE "user_friends"."applicantId" = $1 AND "user_friends"."status" = $2)`,
        [
          userId,
          UserFriendsRelation.BLOCKED
        ]);
    } catch (error) {
      throw error;
    }
  }

  /* this function used for return all users that have no relations with the logged user*/
  async getNoRelationUsers(userId: number): Promise<User[]> {
    try {
      return await this.connection.getRepository(UserFriends).query(
        `SELECT * FROM users
        WHERE "users"."id"
        NOT IN (SELECT "recipientId" FROM user_friends
        WHERE ("user_friends"."recipientId" = $1 OR "user_friends"."applicantId" = $1)
        AND ("user_friends"."status" = $2 OR "user_friends"."status" = $3 OR  "user_friends"."status" = $4))
        AND "users"."id"
        NOT IN (SELECT "applicantId" FROM user_friends
        WHERE ("user_friends"."applicantId" = $1 OR "user_friends"."recipientId" = $1)
        AND ("user_friends"."status" = $2 OR "user_friends"."status" = $3 OR  "user_friends"."status" = $4))
      `, [
        userId,
        UserFriendsRelation.ACCEPTED,
        UserFriendsRelation.PENDING,
        UserFriendsRelation.BLOCKED
      ]);
    } catch (e) {
      throw e;
    }
  }

  /* Removing any relation between the logged user and the guest user */
  async removeRelation(userId: number, rejectedId: number): Promise<User> {
    await this.connection.getRepository(UserFriends).query(
      `DELETE FROM user_friends
      WHERE ("user_friends"."recipientId" = $1 AND "user_friends"."applicantId" = $2)
      OR ("user_friends"."recipientId" = $2 AND "user_friends"."applicantId" = $1)
      `,
      [userId, rejectedId]
    );
    const user = await this.connection.getRepository(User).findOne(rejectedId);
    if (user) {
      return user;
    }
    throw new NotFoundException('User not found');
  }

  //* Turn on the two factor authentication
  async turnOnOffTwoFactorAuth(userId: number, bool: boolean): Promise<User> {
    try {
      await this.connection.getRepository(User).update(userId, {
        is_2fa_enabled: bool,
      });
      const user = await this.connection.getRepository(User).findOne(userId);
      if (user) {
        return user;
      }
      throw new NotFoundException('User not found');
    } catch (err) {
      throw err;
    }
  }


  //* get the user profile
  getUserProfileById = async (userId: number): Promise<User> => {
    try {
      const user = await this.connection.getRepository(User).findOne(userId);
      if (user) {
        return user;
      }
      throw new NotFoundException('User not found');
    } catch (err) {
      throw err;
    }
  }

  //* Get non-blocked-users
  getNonBlockedUsers = async (userId: number): Promise<User[]> => {
    return await this.connection.getRepository(User).query(
      `SELECT * FROM users
      WHERE ("users"."id" != $1)
      AND "users"."id"
      NOT IN (SELECT "recipientId" FROM user_friends WHERE "user_friends"."applicantId" = $1 AND "user_friends"."status" = $2)
      AND "users"."id"
      NOT IN (SELECT "applicantId" FROM user_friends WHERE "user_friends"."recipientId" = $1 AND "user_friends"."status" = $2)`,
      [userId, UserFriendsRelation.BLOCKED]
    );
  }
};
