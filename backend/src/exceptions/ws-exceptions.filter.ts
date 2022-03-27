import { ArgumentsHost, Catch } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";
import { Socket } from "socket.io"

@Catch(WsException)
export class WsExceptionsFilter extends BaseWsExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const client = host.switchToWs().getClient() as Socket;
        const err = exception instanceof WsException ? exception.getError() : exception.getResponse();
        const message = err.error;
        const status = err.status || 403;
        client.emit("error", {
            status,
            message,
        }
        );
    }
}