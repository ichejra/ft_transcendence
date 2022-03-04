import { ISendMailOptions, MailerOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService ) {}

    async sendMail(options: ISendMailOptions): Promise<any> {
        return await this.mailerService.sendMail(options);
    }
}
