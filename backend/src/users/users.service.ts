import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, UpdateResult, DeleteResult } from 'typeorm'

import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
    private usersRepository: Repository<User> 
    ) {}

  async create(user: UserDto) : Promise<UserDto>{
    try {
      return await this.usersRepository.save(user);
    } catch (e) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: `Forbidden: cannot create user.`,
      }, HttpStatus.FORBIDDEN);
    }
  }

  findAll() : Promise<UserDto[]>{
    return this.usersRepository.find();
  }

  async findOne(id: number | string): Promise<UserDto> {
    try{
      const user = await this.usersRepository.findOne(id);
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    }
    catch(e) {
      throw e;
    }
  }

  async update(id: number | string, data: UpdateUserDto) : Promise<UserDto> {
    try{
      await this.usersRepository.update(id, data);
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
}
