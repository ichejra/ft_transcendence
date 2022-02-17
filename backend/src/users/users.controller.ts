import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserDto } from "src/users/dto/user.dto";
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() data: Prisma.UsersCreateInput): Promise<UserDto> {
    return this.usersService.create(data);
  }

  @Get()
  findAll() : Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<UserDto> {
    return this.usersService.findOne({ id: +id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.UsersUpdateInput): Promise<UserDto> {
    return this.usersService.update({id: +id}, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) : Promise<UserDto> {
    return this.usersService.remove({ id : +id });
  }
}
