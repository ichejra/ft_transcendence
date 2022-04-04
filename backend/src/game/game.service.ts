//* deal with the database
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameDto } from './dto/game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async insertGameData(data: GameDto): Promise<Game> {
    return await this.gameRepository.save({
      winner: data.winner,
      loser: data.loser,
      score: data.score,
    });
  }
}
