class Consts {
  // private readonly 'STARTING OF ALL COMPONENTS';
  static readonly CANVAS_H = 600;
  static readonly CANVAS_W = 1000;
  static readonly MAX_SCORE = 10;
  static readonly MAX_WATCHERS = 10;
  static readonly BALL_RADIUS = 12;
  static readonly BALL_INIT_X = Consts.CANVAS_W/2;
  static readonly BALL_INIT_Y = Consts.CANVAS_H/2;
  static readonly BALL_SPEED = 5;
  static readonly BALL_MAX_SPEED = 15;
  static readonly PADDLE_W = 20;
  static readonly PADDLE_H = 100;
  static readonly PADDLE_DIFF = 10;
  static readonly L_PADDLE_X = Consts.PADDLE_W;
  static readonly R_PADDLE_X = Consts.CANVAS_W - Consts.PADDLE_W;
  static readonly M_PADDLE_X = Consts.CANVAS_W / 2 - Consts.PADDLE_W / 2;
  static readonly PADDLE_INIT_Y = Consts.CANVAS_H / 2 - Consts.PADDLE_H / 2;
}

export default Consts;