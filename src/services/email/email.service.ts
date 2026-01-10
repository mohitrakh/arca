import nodemailer from 'nodemailer';
import env from '../../config/env';

class EmailService {
    private transporter = nodemailer.createTransport({
        // Configure with your SMTP settings in .env
        host: env.email.host,
        port: env.email.port,
        auth: { user: env.email.user, pass: env.email.pass },
    });

    async sendHtmlEmail(to: string, subject: string, html: string) {
        return await this.transporter.sendMail({
            from: `"Arca Team" <${env.email.fromEmail}>`,
            to,
            subject,
            html,
        });
    }
}

export const emailService = new EmailService();