import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDto } from "src/users/dto/user.dto";
import { UpdateUserDto } from './dto/update-user.dto';

import { UsersService } from './users.service';

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
  findOne(@Param('id', ParseIntPipe) id: string): Promise<UserDto> {
    return this.usersService.findOne({ id: Number(id) });
  }

  @Patch('/:id')
  update(@Param('id', ParseIntPipe) id: string, @Body() data: UpdateUserDto): Promise<UserDto> {
    return this.usersService.update({id: Number(id) }, data);
  }

  @Delete('/:id')
  remove(@Param('id', ParseIntPipe) id: string) : Promise<UserDto> {
    return this.usersService.remove({ id : Number(id) });
  }

}
