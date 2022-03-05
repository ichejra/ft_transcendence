//* deal with the database
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InsertValuesMissingError, Repository } from "typeorm";
import { GameDto } from "./dto/game.dto";
import { Game } from "./entities/game.entity";
import { GameInterface } from "./interfaces/game.interface";

@Injectable()
export class GameService {
  logger: Logger;
  //! understanding purpose
  // private readonly game: GameInterface[] = [
  //   {
  //     id: '32323133',
  //     name: 'hahah',
  //     qty: 7,
  //     description: 'game1',
  //   },
  //   {
  //     id: '377899',
  //     name: 'hahah2',
  //     qty: 7,
  //     description: 'game2',
  //   },
  // ];
  constructor(
    @InjectRepository(Game)
  private gameRepository: Repository<Game>) {
    this.logger = new Logger();
  }
  //* database returns a promise so we should return a promise too
  async findAll(): Promise<Game[]> {
    // return this.game; instead of this we should return a gamerepository from our data base
    return await this.gameRepository.find();
  }
  async findOne(id: string): Promise<Game> {
    return await this.gameRepository.findOne({__id: id}); //! what is _id in typeorm
    // return await this.gameRepository.find(); instead of this we should return a gamerepository from our data base
  }
  async create(game: GameInterface): Promise<Game> {
    const newGame = new this.gameRepository(game);
    return await newGame.save();
  }
  async delete(id: string): Promise<Game> {
    return await this.gameRepository.findByIdAndRemove(id); //! look for the similar function of findByIdAndRemiove in typeore
  }
  async update(id: string, game: Game) : Promise<Game> {
    return await this.gameRepository.findByIdAndUpdate(id, game, { new: true }); //! look for the similar function of findByIdAndUpdate in typeore
  }
  //! understanding purpose
  // private readonly game: GameInterface
  // constructor(
  //   @InjectRepository(Game)
  //   private gameRepository: Repository<Game>
  //   ) {}

  //   async insertGameData(data: GameDto) : Promise<Game> {
  //     return this.gameRepository.save(data);
  //   }
}
