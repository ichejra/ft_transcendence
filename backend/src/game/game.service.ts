import { Injectable } from "@nestjs/common";
import { GameInterface } from "./interfaces/game.interface";
@Injectable()
export class GameService {
  constructor(private gameIn: GameInterface) {}
  getInterface() {

    this.gameIn.x = 0;
    this.gameIn.y = 10;
    this.gameIn.width = 1000;
    this.gameIn.height = 600;
    this.gameIn.color = "white";
    return this.gameIn;
  }
}