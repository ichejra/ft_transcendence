export interface BroadcastObject {
  ball: {
    x: number;
    y: number;
  };
  paddles: {
    leftPad: number;
    rightPad: number;
    leftPadH: number;
    rightPadH: number;
  };
  score: {
    score1: number;
    score2: number;
  };
  state: string;
}
