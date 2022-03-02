import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('game')
export class Game {
  @PrimaryGeneratedColumn()
  id: number;
}
