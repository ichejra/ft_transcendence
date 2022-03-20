import {
    HttpException,
    HttpStatus
} from "@nestjs/common";

export class NotFoundException extends HttpException  {
    constructor() {
      super('resource not found.', HttpStatus.NOT_FOUND);
    }
}
