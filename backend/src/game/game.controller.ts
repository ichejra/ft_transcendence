import { Controller, Get, HttpCode, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ReqUser } from "src/users/decorators/req-user.decorator";
import { User } from "src/users/entities/user.entity";
import { Game } from "./entities/game.entity";
import { GameService } from "./game.service";

@Controller('games')
export class GameController {
    constructor(private gameService: GameService) {}
    
    @Get()
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getGamesHistory(@ReqUser() user: User): Promise<Game[]> {
        return this.gameService.getGamesHistory(Number(user.id));
    }
}
