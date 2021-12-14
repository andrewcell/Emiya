/**
 * @packageDocumentation
 * @hidden
 */

import mail from '@sendgrid/mail';
import logger from '@shared/Logger';
import {MailDataRequired} from '@sendgrid/mail/src/mail';
import {ResponseError} from '@sendgrid/helpers/classes';

export class SendGrid {
    private static apiKey = process.env.SENDGRID;
    private static sender = process.env.SENDGRIDSENDER as string;
    public static send(to: string, subject: string, html: string): Promise<boolean> {
        mail.setApiKey(SendGrid.apiKey as string);
        const message: MailDataRequired = { to, from: SendGrid.sender, subject, html };
        return new Promise((resolve) => {
            mail.send(message)
                .then(res => {
                    logger.info(res)
                    resolve(true)
                })
                .catch((e: Error) => {
                    logger.error(e.message, e)
                    resolve(false)
                });
        })
    }
}