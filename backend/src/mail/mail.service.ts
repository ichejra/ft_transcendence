import {
    ISendMailOptions,
    MailerService
} from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {

    constructor(private mailerService: MailerService) { }

    // method use for sending validition email
    async sendMail(options: ISendMailOptions): Promise<any> {
        try {
            return await this.mailerService.sendMail(options);
        } catch (error) {
            throw error;
        }
    }
}
