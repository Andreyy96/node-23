import { EmailTypeEnum } from "../enums/email-type.enum";

export const emailTemplateConstant = {
  [EmailTypeEnum.WELCOME]: {
    templateId: "d-52304064661440c78bde58b7e08cfd34",
  },
  [EmailTypeEnum.RESET_PASSWORD]: {
    templateId: "d-3843374941d74d0dbdb987d2095d19fd",
  },
  [EmailTypeEnum.DELETE_ACCOUNT]: {
    templateId: "d-6bca9d21f783422b960225e97c0c41c1",
  },
  [EmailTypeEnum.LOGOUT]: {
    templateId: "",
  },
  [EmailTypeEnum.COME_BACK]: {
    templateId: "d-0460872d293e4145b29f202979699673",
  },
};
