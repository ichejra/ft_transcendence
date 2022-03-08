import { Injectable } from '@nestjs/common';
export interface User {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  score: number;
}
export interface Ball {
  x: number;
  y: number;
  radius: number;
  speed: number;
  velocityX: number;
  velocityY: number;
  color: string;
}
export interface Net {
  x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}
export interface Comp {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  score: number;
};

@Injectable()
export class UserService {
  public getUser() : User {
    return {
      x: 1000 / 30,
      y: 600 / 2 - 100 / 2, //100 is the height
      width: 15,
      height: 100,
      color: 'white',
      score: 0,
    };
  }
}