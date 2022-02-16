import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { IntraAuthGuard } from 'src/auth/intra-auth.guard';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() data: Prisma.UsersCreateInput): Promise<Users> {
    return this.usersService.create(data);
  }

  @Get()
  findAll() : Promise<Users[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Users> {
    return this.usersService.findOne({ id: +id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.UsersUpdateInput): Promise<Users> {
    return this.usersService.update({id: +id}, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) : Promise<Users> {
    return this.usersService.remove({ id : +id });
  }
}
