import mail from '@sendgrid/mail';
import logger from '@shared/Logger';
import {MailDataRequired} from '@sendgrid/mail/src/mail';

export class SendGrid {
    private static apiKey = process.env.SENDGRID;
    private static sender = process.env.SENDGRIDSENDER as string;
    public static async send(to: string, subject: string, html: string): Promise<boolean> {
        mail.setApiKey(SendGrid.apiKey as string);
        const message: MailDataRequired = { to, from: SendGrid.sender, subject, html };
        try {
            const result = await mail.send(message)
            logger.info(result)
        } catch (e) {
            logger.error(e.message, e)
        }
        return false;
    }
}