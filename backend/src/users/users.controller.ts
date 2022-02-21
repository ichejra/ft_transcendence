import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Req, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Prisma } from '@prisma/client';
import multer, { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDto } from "src/users/dto/user.dto";
import { UpdateUserDto } from './dto/update-user.dto';

import { UsersService } from './users.service';

const editFilename = (_req, file, cb) =>  {
    cb(null, _req.user.id + extname(file.originalname));
}
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() data: UserDto) : Promise<UserDto> {
    return this.usersService.create(data);
  }

  @Get()
  findAll() : Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async login(@Req() _req: any) {
    console.log(_req);
    return await this.usersService.findOne({ user_name: _req.user.user_name });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: string): Promise<UserDto> {
    return this.usersService.findOne({ id: Number(id) });
  }

  @Patch('update-username')
  @UseGuards(JwtAuthGuard)
  updateUsername(@Req() _req: any) {
    return this.usersService.update({ id: _req.user.id }, { user_name: _req.user.user_name })
  }
  
  @Patch('update-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: process.env.DESTINATION,
      filename: editFilename,
    }),
  }),
  )
  updateAvatar(@Req() _req: any, @UploadedFile() file: Express.Multer.File): Promise<UserDto> {
    console.log(file);
    const url = `http://localhost:3000/${file.filename}` ;
    return this.usersService.update({ id: _req.user.id }, { avatar_url: url });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: string) : Promise<UserDto> {
    return this.usersService.remove({ id : Number(id) });
  }

}
