import { Controller, Get } from "@nestjs/common";
import { ForbiddenException } from "./exceptions/forbidden.exception";

@Controller('/')
export class AppController {

    @Get()
    default() {
        throw new ForbiddenException();
    }
    
}
