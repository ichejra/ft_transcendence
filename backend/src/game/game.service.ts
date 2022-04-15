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
  ) { }


  async insertGameData(data: GameDto): Promise<Game> {
    return await this.gameRepository.save({
      winner: data.winner,
      winnerScore: data.winnerScore,
      loser: data.loser,
      loserScore: data.loserScore,
      score: data.score,
    });
  }

  async getGamesHistory(playerId: number): Promise<Game[]> {
    const games: Game[] = await this.gameRepository.find({
      relations: ['winner', 'loser'],
      where: [{
        winner: playerId,
      }, {
        loser: playerId,
      }]
    });
    return games;
  }
}
