import {
  HttpException,
  Injectable,
} from '@nestjs/common';
import { ForbiddenException } from 'src/exceptions/forbidden.exception';
import { NotFoundException } from 'src/exceptions/not-found.exception';
import { Connection } from 'typeorm'

import { UserDto } from './dto/user.dto';
import {
  UserFriends,
  UserFriendsRelation
} from './entities/user-friends.entity';
import { User, UserState } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private connection: Connection,
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
      throw err;
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
      if (!file && user_name) {
        await this.connection.getRepository(User).update(id, { user_name: user_name });
      } else if (!user_name && file) {
        await this.connection.getRepository(User).update(id,
          { avatar_url: `http://${process.env.HOST}:${process.env.PORT}/${file.filename}` }
        );
      } else if (file && user_name) {
        await this.connection.getRepository(User).update(id,
          {
            user_name: user_name,
            avatar_url: `http://${process.env.HOST}:${process.env.PORT}/${file.filename}`
          });
      }
      const user = await this.connection.getRepository(User).findOne(id);
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (e) {
      throw new ForbiddenException('could not update the profile');
    }
  }

  // function used for updating user state
  updateState = async (id: number, state: UserState): Promise<User> => {
    await this.connection.getRepository(User).update(id, { state: state });
    return await this.connection.getRepository(User).findOne(id);
  }

  async remove(id: number | string): Promise<any> {
    try {
      return await this.connection.getRepository(User).delete(id);
    }
    catch (e) {
      throw new ForbiddenException('cannot delete the profile');
    }
  }

  async logout(_req: any, _res: any): Promise<any> {
    const user = await this.connection.getRepository(User).findOne(Number(_req.user.id));
    if (user) {
      _res.clearCookie('jwt');
    }
    _res.redirect(process.env.HOME_PAGE);
  }

  // method used for insert the logged user id and requested user id in a database table("user_friends") with status pending until accept
  async insertToFriends(userId: any, recipientId: any): Promise<User> {
    try {
      const relation = await this.connection.getRepository(UserFriends).query(
        `SELECT "id" FROM user_friends
        WHERE ("applicantId" = $1 AND "recipientId" = $2)
        OR ("recipientId" = $1 AND "applicantId" = $2)`,
        [
          userId,
          recipientId
        ]
      );
      if (relation.length === 0) {
        await this.connection.getRepository(UserFriends).save({ applicant: userId, recipient: recipientId });
      }
      const user = await this.connection.getRepository(User).findOne({ where: { id: recipientId } });
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  // method used for accept the request friend (applicantId) by update status in databases from pending to accepted
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
      if (!user) {
        throw new NotFoundException();
      }
      return user;
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
        throw new NotFoundException();
      }
      const blocked = await this.connection.getRepository(User).findOne(blockId);
      if (!blocked) {
        throw new NotFoundException();
      }
      let relation = await this.connection.getRepository(UserFriends).findOne({
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
      throw error;
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
      const user = await this.connection.getRepository(User).findOne({ where: { id: unblockId } });
      if (!user) {
        throw new NotFoundException();
      }
      return user;
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
    if (!user) {
      throw new NotFoundException();
    }
    return user;

  }

  /* Turn on the two factor authentication */
  async turnOnOffTwoFactorAuth(userId: number, bool: boolean): Promise<User> {
    try {
      await this.connection.getRepository(User).update(userId, {
        is_2fa_enabled: bool,
      });
      const user = await this.connection.getRepository(User).findOne(userId);
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (e) {
      throw e;
    }
  }


  /* get the user profile */
  getUserProfileById = async (userId: number): Promise<User> => {
    try {
      const user = await this.connection.getRepository(User).findOne(userId);
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

};
