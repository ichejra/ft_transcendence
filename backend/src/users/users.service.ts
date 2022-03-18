import {
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { Connection } from 'typeorm'

import { UserDto } from './dto/user.dto';
import {
  UserFriends,
  UserFriendsRelation
} from './entities/user-friends.entity';
import { User, UserState } from './entities/user.entity';

class NotFoundException extends HttpException {
  constructor() {
    super('resource is not found.', HttpStatus.NOT_FOUND);
  }
}

@Injectable()
export class UsersService {
  constructor(
    private connection: Connection,
    ) {}

  async create(user: UserDto) : Promise<User>{
    try {
      return await this.connection.getRepository(User).save(user);
    } catch (e) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: `Forbidden: cannot create user.`,
      }, HttpStatus.FORBIDDEN);
    }
  }

  findAll() : Promise<User[]>{
    return this.connection.getRepository(User).find();
  }

  async findOne(id: number | string): Promise<User> {
      const user = await this.connection.getRepository(User).findOne(id);
      if (!user) {
        return null;
      }
      return user;
  }

  async updateProfile(id: number, user_name: string, file: Express.Multer.File) : Promise<UserDto> {
    try{
       if (!file && user_name) {
        await this.connection.getRepository(User).update(id, {user_name: user_name});
      } else if (!user_name && file) {
        await this.connection.getRepository(User).update(id,
          { avatar_url:  `http://${process.env.HOST}:${process.env.PORT}/${file.filename}`}
          );
      } else if (file && user_name) {
        await this.connection.getRepository(User).update(id,
          { 
            user_name: user_name,
            avatar_url:  `http://${process.env.HOST}:${process.env.PORT}/${file.filename}`
          });
      }
      return await this.connection.getRepository(User).findOne(id);
    } catch(e) {
      throw new NotFoundException();
    }
  }

  // function used for updating user state
  updateState = async (id: number, state: UserState) : Promise<User> => {
    return await this.connection.getRepository(User).update(id, { state: state }
      ).then( async () => {
      return await this.connection.getRepository(User).findOne(id);
    });
  }

  async remove(id: number | string): Promise<any> {
    try {
      return await this.connection.getRepository(User).delete(id);
    }
    catch(e) {
      throw new NotFoundException();
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
    const relation = await this.connection.getRepository(UserFriends).query(
      `SELECT "id" FROM user_friends
      WHERE ("applicantId" = $1 AND "recipientId" = $2)
      OR ("recipientId" = $1 AND "applicantId" = $2)`,
      [
        userId,
        recipientId
      ]
    );
    if (!relation.length) {
      await this.connection.getRepository(UserFriends).save({applicant: userId, recipient: recipientId});
    }
    return await this.connection.getRepository(User).findOne({where: {id: recipientId}});
  }
  
  // method used for accept the request friend (applicantId) by update status in databases from pending to accepted
  async acceptFriend(userId, applicantId): Promise<User> {
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
    return await this.connection.getRepository(User).findOne({where: {id: applicantId}}); // return the accpeted friend
  }

  /* method used for block a friend 
    if the relation exist we update the status from pending or accpeted to blocked
    else if no relation we creating the relation and set the status to blocked
  */
  async blockFriend(userId: number, blockId: number): Promise<User> {
    const relation = await this.connection.getRepository(UserFriends).query(
      `SELECT * FROM user_friends
      WHERE ("recipientId" = $1 AND "applicantId" = $2)
      OR ("applicantId" = $1 AND "recipientId" = $2)`,
      [
        userId,
        blockId
      ]);
    if (!relation.length) {
      await this.insertToFriends(userId, blockId); 
    }
    await this.connection.getRepository(UserFriends).query(
      `UPDATE user_friends
      SET "status" = $1
      WHERE ("recipientId" = $2 AND "applicantId" = $3)
      OR ("applicantId" = $2 AND "recipientId" = $3)`,
      [
        UserFriendsRelation.BLOCKED,
        userId,
        blockId
      ]);
    return await this.connection.getRepository(User).findOne({where: {id: blockId}}); // return the blocked user
  }

  /* method used to unblock a user by update status to accepted or pending */ // this one might get some changes
                                                                            // delete the relation instead of updating the relation status
  async unblockFriend(userId: number, unblockId: number): Promise<User> {
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
    return await this.connection.getRepository(User).findOne({ where:{id: unblockId}});
  }

  /* used for getting all the pending requests of the users  */
  async getPendingRequests(userId: number) : Promise<User[]> {
    /* Removed lines */
    // IN (SELECT "recipientId" FROM user_friends WHERE "user_friends"."applicantId" = $1 AND "user_friends"."status" = $2)
    // OR "users"."id"
    return await this.connection.getRepository(UserFriends).query(
      `SELECT * FROM users
      WHERE "users"."id"
      IN (SELECT "applicantId" FROM user_friends WHERE "user_friends"."recipientId" = $1 AND "user_friends"."status" = $2)`,
      [
        userId, 
        UserFriendsRelation.PENDING
      ]);
    }
    
    
  /* used for getting the friends */
  async getUserFriends(userId: number) : Promise<User[]> {
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
  }

  /* used for getting the blocked users */
  async getBlockedFriends(userId: number) : Promise<User[]> {
    return await this.connection.getRepository(UserFriends).query(
      `SELECT * FROM users
      WHERE "users"."id"
      IN (SELECT "recipientId" FROM user_friends WHERE "user_friends"."applicantId" = $1 AND "user_friends"."status" = $2)
      OR "users"."id"
      IN (SELECT "applicantId" FROM user_friends WHERE "user_friends"."recipientId" = $1 AND "user_friends"."status" = $2)`,
      [
        userId,
        UserFriendsRelation.BLOCKED
      ]);
  }

  /* this function used for return all users that have no relations with the logged user*/
  async getNoRelationUsers(userId: number) : Promise<User[]> {
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
  }

  /* Removing any relation between the logged user and the guest user */
  async removeRelation(userId: number, rejectedId: number): Promise<User> {
    return await this.connection.getRepository(UserFriends).query(
      `DELETE FROM user_friends
      WHERE ("user_friends"."recipientId" = $1 AND "user_friends"."applicantId" = $2)
      OR ("user_friends"."recipientId" = $2 AND "user_friends"."applicantId" = $1)
      `,
      [userId, rejectedId]
    ).then( async () => {
      return await this.connection.getRepository(User).findOne(rejectedId);
    })
  }

  /* Turn on the two factor authentication */
  async turnOnTwoFactorAuthentication(userId: number, bool: boolean): Promise<User> {
    return await this.connection.getRepository(User).update(userId, {
      is_2fa_enabled: bool,
    }).then( async () => {
      return await this.connection.getRepository(User).findOne(userId);
    });
  }

};
