import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Req, ParseIntPipe, UseInterceptors, UploadedFile, HttpCode, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DeleteResult } from 'typeorm';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDto } from "src/users/dto/user.dto";
import { UsersService } from './users.service';
import * as dotenv from 'dotenv';
import { editFileName, fileFilter } from './utils/file-upload.utils';
import { User } from './entities/user.entity';
import { ReqUser } from './decorators/req-user.decorator'

dotenv.config()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('create')
  @HttpCode(200)
  create(@Body() data: UserDto): Promise<UserDto> {
    return this.usersService.create(data);
  }

  /* route get all users 
    https://${host}:${port}/api/users/all_users
  */
  @Get('/all_users')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /* route get the logged user 
    http://${host}:${port}/api/users/me
  */
  @Get('me')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  getProfile(@ReqUser() user: User /*@Req() _req: any*/) {
    return this.usersService.findOne(Number(user.id));
  }

  @Patch('update-profile')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: process.env.DESTINATION,
      filename: editFileName,
    }),
    fileFilter: fileFilter,
  }),
  )
  update(@ReqUser() user: User, @Body('user_name') user_name: string, @UploadedFile() file: Express.Multer.File): Promise<User> {
    return this.usersService.updateProfile(Number(user.id), user_name, file);
  }

  /* Route delete user 
    http://${host}:${port}/api/users/remove-user/:userId
  */
  @Delete('/remove-user/:userId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  remove(@Param('userId', ParseIntPipe) userId: string): Promise<DeleteResult> {
    return this.usersService.remove(Number(userId));
  }

  /* User friends section */
  /* Route: send friend request
    http://${host}:${port}/api/users/friend-request/
    add to friends with pending status
    */
  @Patch('/friend-request/')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  sendReqFriend(@ReqUser() user: User, @Body('recipientId') recipientId: number | string): Promise<User> {
    return this.usersService.insertToFriends(Number(user.id), Number(recipientId))
  }

  /* Route: accept friend
    http://${host}:${port}/api/users/friend-accepte/
    -> user who logged is the recipeint and the applicant will be accpeted
    */
  @Patch('/friend-accept/')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  acceptReqFriend(@ReqUser() user: User, @Body('applicantId') applicantId: number | string): Promise<User> {
    return this.usersService.acceptFriend(Number(user.id), Number(applicantId));
  }

  /* Route: block friend
    http://${host}:${port}/api/users/friend-accept/
    */
  @Patch('/friend-block/')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  blockFriend(@ReqUser() user: User, @Body('blockId') blockId: number | string): Promise<User> {
    return this.usersService.blockFriend(Number(user.id), Number(blockId));
  }

  /* Route: unblock friend
    http://${host}:${port}/api/users/friend-unblock/
  */
  @Patch('/friend-unblock/')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  unblockFriend(@ReqUser() user: User, @Body('unblockId') unblockId: number | string): Promise<User> {
    return this.usersService.unblockFriend(Number(user.id), Number(unblockId));
  }

  /* Route: get pending requests 
    http://${host}:${port}/api/users/pending-friends/
  */
  @Get('/pending-friends')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  pendingFriends(@ReqUser() user: User): Promise<User[]> {
    return this.usersService.getPendingRequests(user.id);
  }

  /* Route friends:
    http://${host}:${port}/api/users/friends
    -> return all friends of the logged user
  */
  @Get('/friends')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  getFriends(@ReqUser() user: User): Promise<User[]> {
    return this.usersService.getUserFriends(Number(user.id))
  }

  /* Route blocked friends 
    http://${host}:${port}/api/users/blocked-friends
    -> return all the blocked friends from the user
  */
  @Get('/blocked-friends')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  getBlockedFriends(@ReqUser() user: User): Promise<User[]> {
    return this.usersService.getBlockedFriends(Number(user.id));
  }

  /* Route no relation users
    http://${host}:${port}/api/users/no_rolation
    -> return all users that does not has any relation with the logged user.
  */
  @Get('/no_relation')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  getNoRelationUsers(@ReqUser() user: User): Promise<User[]> {
    return this.usersService.getNoRelationUsers(Number(user.id));
  }

  /* Route for cancelling, rejecting and removing a friend 
    http://${host}:${port}/api/users/remove-relation
  */
  @Patch('remove-relation')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  removeRelation(@ReqUser() user: User, @Body('rejectedId') rejectedId: number | string): Promise<User> {
    return this.usersService.removeRelation(Number(user.id), Number(rejectedId));
  }
}
