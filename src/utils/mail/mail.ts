import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

const tranporter = nodemailer.createTransport({
  service: process.env.EMAIL_SMTP_SERVICE_NAME,
  host: process.env.EMAIL_SMTP_HOST,
  port: Number(process.env.EMAIL_SMTP_PORT),
  secure: process.env.EMAIL_SMTP_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SMTP_USER,
    pass: process.env.EMAIL_SMTP_PASS,
  },
  requireTLS: true,
});

export interface ISendMail {
  from: string;
  to: string;
  subject: string;
  content: string;
}

export const sendEmail = async ({ from, to, subject, content }: ISendMail) => {
  const result = await tranporter.sendMail({
    from,
    to,
    subject,
    html: content,
  });
  return result;
};

export const renderMailHTML = async (
  template: string,
  data: any
): Promise<string> => {
  const content = await ejs.renderFile(
    path.join(__dirname, `templates/${template}`),
    data
  );
  return content as string;
};
