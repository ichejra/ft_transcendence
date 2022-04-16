import { User } from "src/users/entities/user.entity"

export type GameRank = {
    user: User,
    score: number,
}