import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('game')
export class Game /* extends BaseEntity */ {
  @PrimaryGeneratedColumn()
  id: number;

  //* add other columns
  @Column()
  title: string;

  @Column()
  description: string;
}

//* create a table in our database
