import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, UpdateResult, DeleteResult } from 'typeorm'

import { UserDto } from './dto/user.dto';
import { UserFriends, UserFriendsRelation } from './entities/user-friends.entity';
import { User } from './entities/user.entity';

class NotFoundException extends HttpException {
  constructor() {
    super('resource is not found.', HttpStatus.NOT_FOUND);
  }
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserFriends)
    private userFriendsRepository: Repository<UserFriends>
    ) {}

  async create(user: UserDto) : Promise<User>{
    try {
      return await this.usersRepository.save(user);
    } catch (e) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: `Forbidden: cannot create user.`,
      }, HttpStatus.FORBIDDEN);
    }
  }

  findAll() : Promise<User[]>{
    return this.usersRepository.find();
  }

  async findOne(id: number | string): Promise<User> {
      const user = await this.usersRepository.findOne(id);
      if (!user) {
        return null;
      }
      return user;
  }

  async updateProfile(id: number, user_name: string, file: Express.Multer.File) : Promise<UserDto> {
    try{
       if (!file && user_name) {
        await this.usersRepository.update(id, {user_name: user_name});
      } else if (!user_name && file) {
        await this.usersRepository.update(id, 
          { avatar_url:  `http://${process.env.HOST}:${process.env.PORT}/${file.filename}`}
          );
      } else if (file && user_name) {
        await this.usersRepository.update(id,
          { user_name: user_name,
            avatar_url:  `http://${process.env.HOST}:${process.env.PORT}/${file.filename}`
          });
      }
      return await this.usersRepository.findOne(id);
    } catch(e) {
      throw new NotFoundException();
    }
  }

  async remove(id: number | string): Promise<DeleteResult> {
    try{
      return await this.usersRepository.delete(id);
    }
    catch(e) {
      throw new NotFoundException();
    }
  }

  async logout(_req: any, _res: any): Promise<any> {
    const user = await this.usersRepository.findOne(Number(_req.user.id));
    if (user) {
        _res.clearCookie('jwt');
    }
    _res.redirect(process.env.HOME_PAGE);
  }

  // method used for insert the logged user id and requested user id in a database table("user_friends") with status pending until accept
  async insertToFriends(userId, recipientId): Promise<User> {
    const relation = await this.userFriendsRepository.query(
      `SELECT "id" FROM user_friends
      WHERE ("applicantId" = $1 AND "recipientId" = $2)
      OR ("recipientId" = $1 AND "applicantId" = $2)`,
      [
        userId,
        recipientId
      ]
    );
    if (!relation.length) {
      await this.userFriendsRepository.save({applicant: userId, recipient: recipientId});
    }
    return await this.usersRepository.findOne({where: {id: recipientId}});
  }
  
  // method used for accept the request friend (applicantId) by update status in databases from pending to accepted
  async acceptFriend(userId, applicantId): Promise<User> {
    await this.userFriendsRepository.query(
      `UPDATE user_friends
      SET  "status" = $1
      WHERE "recipientId" = $2
      AND "applicantId" = $3`,
      [
        UserFriendsRelation.ACCEPTED,
        userId,
        applicantId
      ]);
    return await this.usersRepository.findOne({where: {id: applicantId}}); // return the accpeted friend
  }

  /* method used for block a friend 
    if the relation exist we update the status from pending or accpeted to blocked
    else if no relation we creating the relation and set the status to blocked
  */
  async blockFriend(userId: number, blockId: number): Promise<User> {
    const relation = await this.userFriendsRepository.query(
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
    await this.userFriendsRepository.query(
      `UPDATE user_friends
      SET "status" = $1
      WHERE ("recipientId" = $2 AND "applicantId" = $3)
      OR ("applicantId" = $2 AND "recipientId" = $3)`,
      [
        UserFriendsRelation.BLOCKED,
        userId,
        blockId
      ]);
    return await this.usersRepository.findOne({where: {id: blockId}}); // return the blocked user
  }

  /* method used to unblock a user by update status to accepted or pending */ // this one might get some changes
                                                                            // delete the relation instead of updating the relation status
  async unblockFriend(userId: number, unblockId: number): Promise<User> {
    await this.userFriendsRepository.query(
      `UPDATE user_friends
      SET "status" = $1
      WHERE ("recipientId" = $2 AND "applicantId" = $3)
      OR ("applicantId" = $2 AND "recipientId" = $3)`, 
      [
        UserFriendsRelation.ACCEPTED,
        userId,
        unblockId
      ]);
    return await this.usersRepository.findOne({ where:{id: unblockId}});
  }

  /* used for getting all the pending requests of the users  */
  async getPendingRequests(userId: number) : Promise<User[]> {
   return await this.userFriendsRepository.query(
      `SELECT * FROM users
      WHERE "users"."id"
      IN (SELECT "recipientId" FROM user_friends WHERE "user_friends"."applicantId" = $1 AND "user_friends"."status" = $2)
      OR "users"."id"
      IN (SELECT "applicantId" FROM user_friends WHERE "user_friends"."recipientId" = $1 AND "user_friends"."status" = $2)`,
      [
        userId, 
        UserFriendsRelation.PENDING
      ]);
  }

  /* used for getting the friends */
  async getUserFriends(userId: number) : Promise<User[]> {
    return await this.userFriendsRepository.query(
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
    return await this.userFriendsRepository.query(
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
    return await this.userFriendsRepository.query(
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

}
