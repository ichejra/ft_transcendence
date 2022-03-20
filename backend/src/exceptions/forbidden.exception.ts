import {
  HttpException,
  HttpStatus
} from "@nestjs/common";

export class ForbiddenException extends HttpException {
    constructor(error: string = 'Forbidden') {
      super(error, HttpStatus.FORBIDDEN);
    }
}
