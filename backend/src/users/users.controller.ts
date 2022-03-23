import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Req, ParseIntPipe, UseInterceptors, UploadedFile, HttpCode, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import  { diskStorage } from 'multer';
import { UpdateResult, DeleteResult } from 'typeorm';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDto } from "src/users/dto/user.dto";
import { UsersService } from './users.service';
import * as dotenv from 'dotenv';
import { editFileName, fileFilter } from './utils/file-upload.utils';
import { User } from './entities/user.entity';

dotenv.config()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @HttpCode(200)
  create(@Body() data: UserDto) : Promise<UserDto> {
    return this.usersService.create(data);
  }

  /* route get all users 
    https://${host}:${port}/api/users/all_users
  */ 
  @Get('/all_users')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  findAll() : Promise<User[]> {
    return this.usersService.findAll();
  }

  /* route get the logged user 
    http://${host}:${port}/api/users/me
  */
  @Get('me')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() _req: any) {
    return this.usersService.findOne( Number(_req.user.id) );
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
  update(@Req() _req: any, @UploadedFile() file: Express.Multer.File): Promise<UserDto> {
    return this.usersService.updateProfile( Number(_req.user.id), _req.body.user_name ,file);
  }

  /* Route delete user 
    http://${host}:${port}/api/users/remove-user/:userId
  */ 
  @Delete('/remove-user/:userId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  remove(@Param('userId', ParseIntPipe) userId: string) : Promise<DeleteResult> {
    return this.usersService.remove( Number(userId));
  }

  /* User friends section */
  /* Route: send friend request
    http://${host}:${port}/api/users/friend-request/
    add to friends with pending status
    */
  @Patch('/friend-request/')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  sendReqFriend(@Req() _req: any, @Body('recipientId') recipientId: number | string): Promise<User> {
    return this.usersService.insertToFriends( Number(_req.user.id), Number(recipientId))
  }

  /* Route: accept friend
    http://${host}:${port}/api/users/friend-accepte/
    -> user who logged is the recipeint and the applicant will be accpeted
    */
  @Patch('/friend-accept/')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  acceptReqFriend(@Req() _req: any, @Body('applicantId') applicantId: number | string): Promise<User> {
    return this.usersService.acceptFriend( Number(_req.user.id), Number(applicantId));
  }

  /* Route: block friend
    http://${host}:${port}/api/users/friend-accept/
    */
  @Patch('/friend-block/')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  blockFriend(@Req() _req: any, @Body('blockId') blockId: number | string): Promise<User> {
    return this.usersService.blockFriend(Number(_req.user.id), Number(blockId));
  }

  /* Route: unblock friend
    http://${host}:${port}/api/users/friend-unblock/
  */
  @Patch('/friend-unblock/')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  unblockFriend(@Req() _req: any, @Body('unblockId') unblockId: number | string): Promise<User> {
    return this.usersService.unblockFriend(Number(_req.user.id) ,Number(unblockId));
  }

  /* Route: get pending requests 
    http://${host}:${port}/api/users/pending-friends/
  */
  @Get('/pending-friends')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  pendingFriends(@Req() _req: any): Promise<User[]> {
    return this.usersService.getPendingRequests(_req.user.id);
  }

  /* Route friends:
    http://${host}:${port}/api/users/friends
    -> return all friends of the logged user
  */
  @Get('/friends')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  getFriends(@Req() _req: any): Promise<User[]> {
    return this.usersService.getUserFriends(Number(_req.user.id))
  }

  /* Route blocked friends 
    http://${host}:${port}/api/users/blocked-friends
    -> return all the blocked friends from the user
  */
  @Get('/blocked-friends')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  getBlockedFriends(@Req() _req: any): Promise<User[]> {
    return this.usersService.getBlockedFriends(Number(_req.user.id));
  }

  /* Route no relation users
    http://${host}:${port}/api/users/no_rolation
    -> return all users that does not has any relation with the logged user.
  */
  @Get('/no_relation')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  getNoRelationUsers(@Req() _req: any): Promise<User[]> {
    return this.usersService.getNoRelationUsers(Number(_req.user.id));
  }

  /* Route for cancelling, rejecting and removing a friend 
    http://${host}:${port}/api/users/remove-relation
  */
  @Patch('remove-relation')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  removeRelation(@Req() _req: any, @Body('rejectedId') rejectedId: number | string) : Promise<User> {
    return this.usersService.removeRelation(Number(_req.user.id), Number(rejectedId));
  }
}
