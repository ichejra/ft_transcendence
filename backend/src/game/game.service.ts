//* deal with the database
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { GameDto } from './dto/game.dto';
import { Game } from './entities/game.entity';
import { GameRank } from './type/game-rank.type';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    private userService: UsersService
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

  async getUsersRanking(user: User): Promise<any> {
    const users = await this.userService.getNonBlockedUsers(user.id);
    users.push(user);
    const usersRank: GameRank[] = await Promise.all(users.map(async (user, _) => {
      const { scoreWin } = await this.gameRepository
        .createQueryBuilder("game")
        .select("SUM(game.winnerScore)", "scoreWin")
        .where("game.winnerId = :id", { id: user.id })
        .getRawOne();
      const { scoreLose } = await this.gameRepository
        .createQueryBuilder("game")
        .select("SUM(game.loserScore)", "scoreLose")
        .where("game.loserId = :id", { id: user.id })
        .getRawOne();
      return {
        user: user,
        score: Number(scoreWin) + Number(scoreLose),
      }
    }));
    return await Promise.all(usersRank.sort((uRank1, uRank2) => uRank2.score - uRank1.score));
  }
}
