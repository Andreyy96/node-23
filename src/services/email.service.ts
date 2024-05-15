import path from "node:path";

import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";

import { config } from "../configs/config";
import { emailTemplateConstant } from "../constants/email.constant";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { ApiError } from "../errors/api-error";
import { IMailOptions } from "../interfaces/mail-options.interface";
import { EmailTypeToPayloadType } from "../types/email-type-to-payload.type";

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      from: "No reply",
      service: "gmail",
      auth: {
        user: config.NAME_ACCOUNT_GMAIL,
        pass: config.PASSWORD_ACCOUNT_GMAIL,
      },
    });

    const handlebarOptions = {
      viewEngine: {
        extname: ".hbs",
        defaultLayout: "app",
        layoutsDir: path.join(
          process.cwd(),
          "src",
          "email-templates",
          "layouts",
        ),
        partialsDir: path.join(
          process.cwd(),
          "src",
          "email-templates",
          "partials",
        ),
      },
      viewPath: path.join(process.cwd(), "src", "email-templates", "views"),
      extname: ".hbs",
    };

    this.transporter.use("compile", hbs(handlebarOptions));
  }

  public async sendByType<T extends EmailTypeEnum>(
    to: string,
    type: T,
    dynamicTemplateData: EmailTypeToPayloadType[T],
  ): Promise<void> {
    try {
      const { subject, templateName } = emailTemplateConstant[type];
      await this.sendMail({
        to,
        subject,
        template: templateName,
        context: dynamicTemplateData,
      });
    } catch (error) {
      console.error("Error email: ", error);
    }
  }

  public async sendMail(mailOptions: IMailOptions): Promise<void> {
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const emailService = new EmailService();
