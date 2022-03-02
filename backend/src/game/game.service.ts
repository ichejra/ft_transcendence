import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GameDto } from "./dto/game.dto";
import { Game } from "./entities/game.entity";
import { GameInterface } from "./interfaces/game.interface";
@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>
    ) {}

    async insertGameData(data: GameDto) : Promise<Game> {
      return this.gameRepository.save(data);
    } 
}