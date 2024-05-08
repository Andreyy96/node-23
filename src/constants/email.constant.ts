import { EmailTypeEnum } from "../enums/email-type.enum";

export const emailTemplateConstant = {
  [EmailTypeEnum.WELCOME]: {
    templateName: "register",
    subject: "Welcome to our app",
  },
  [EmailTypeEnum.RESET_PASSWORD]: {
    templateName: "reset-password",
    subject: "Change forgot password",
  },
  [EmailTypeEnum.DELETE_ACCOUNT]: {
    templateName: "delete-account",
    subject: "Your account has been deleted",
  },
  [EmailTypeEnum.LOGOUT]: {
    templateName: "logout",
    subject: "LOGOUT",
  },
};
