import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { UserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma.service';

class NotFoundException extends HttpException {
  constructor() {
    super('resource is not found.', HttpStatus.NOT_FOUND);
  }
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UsersCreateInput) : Promise<UserDto>{
    try {
      return await this.prisma.users.create({
        data
      });
    } catch (e) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: `Forbidden: cannot create user.`,
      }, HttpStatus.FORBIDDEN);
    }
  }

  findAll() : Promise<UserDto[]>{
    return this.prisma.users.findMany();
  }

  async findOne(where: Prisma.UsersWhereUniqueInput): Promise<UserDto> {
    try{
      const user = await this.prisma.users.findUnique({
        where
      });
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    }
    catch(e) {
      throw e;
    }
  }

  async update(where: Prisma.UsersWhereUniqueInput, data: Prisma.UsersUpdateInput) : Promise<UserDto> {
    try{
      return await this.prisma.users.update({
        where,
        data
      });
    } catch(e) {
      throw new NotFoundException();
    }
  }

  async remove(where: Prisma.UsersWhereUniqueInput): Promise<UserDto>{
    try{
      return await this.prisma.users.delete({
        where
      });
    }
    catch(e) {
      throw new NotFoundException();
    }
  }
}
