import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Req, ParseIntPipe, UseInterceptors, UploadedFile, HttpCode } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import  { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateResult, DeleteResult } from 'typeorm';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDto } from "src/users/dto/user.dto";
import { UsersService } from './users.service';
import * as dotenv from 'dotenv';

dotenv.config()

const editFilename = (_req, file, cb) =>  {
    cb(null, _req.user.id + extname(file.originalname));
}
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(200)
  create(@Body() data: UserDto) : Promise<UserDto> {
    return this.usersService.create(data);
  }

  @Get()
  @HttpCode(200)
  findAll() : Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @Get('/me')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async login(@Req() _req: any) {
    return await this.usersService.findOne( _req.user.id );
  }

  @Get('/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: string): Promise<UserDto> {
    return this.usersService.findOne(Number(id));
  }

  @Patch('update-username')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  updateUsername(@Req() _req: any) {
    return this.usersService.update(_req.user.id, { user_name: _req.body.user_name })
  }
  
  @Patch('update-avatar')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: process.env.DESTINATION,
      filename: editFilename,
    }),
  }),
  )
  updateAvatar(@Req() _req: any, @UploadedFile() file: Express.Multer.File): Promise<UpdateResult> {
    return this.usersService.update(_req.user.id , { avatar_url:  `http://localhost:3000/${file.filename}`});
  }

  @Delete('/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: string) : Promise<DeleteResult> {
    return this.usersService.remove( Number(id) );
  }

}
