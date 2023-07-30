import { createTransport } from 'nodemailer';
import { EmailAdapter, ISendMailContent } from '../email';

export class NodemailerAdapter implements EmailAdapter {
  async send(data: ISendMailContent): Promise<void> {
    if(process.env.NOT_SEND_EMAILS) return;

    const transport = createTransport({
      host: process.env.HOST_SENDER as string,
      port: process.env.HOST_PORT_SENDER as unknown as number,
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.PASS_SENDER,
      },
    });

    await transport.sendMail({
      from: data.from,
      to: data.to,
      subject: data.subject,
      html: data.body,
    });
  }
}
