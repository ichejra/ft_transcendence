import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Req, ParseIntPipe, UseInterceptors, UploadedFile, HttpCode } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import  { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateResult, DeleteResult } from 'typeorm';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDto } from "src/users/dto/user.dto";
import { UsersService } from './users.service';
import * as dotenv from 'dotenv';
import { editFileName, fileFilter } from './utils/file-upload.utils';

dotenv.config()
@Controller('users')
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

  @Get('me')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async login(@Req() _req: any) {
    return await this.usersService.findOne( _req.user.id );
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: string): Promise<UserDto> {
    return this.usersService.findOne(Number(id));
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

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: string) : Promise<DeleteResult> {
    return this.usersService.remove( Number(id) );
  }

}
