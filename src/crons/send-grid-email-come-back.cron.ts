import { CronJob } from "cron";

import { EmailTypeEnum } from "../enums/email-type.enum";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { sendGridService } from "../services/send-grid.service";

const handler = async () => {
  try {
    console.log("[START CRON] Send email");
    const users = await userRepository.getList();

    for (const user of users) {
      const tokens = await tokenRepository.findByParams({ _userId: user._id });
      if (!tokens) {
        await sendGridService.sendByType(user.email, EmailTypeEnum.COME_BACK, {
          name: user.name,
        });
      }
    }
    return;
  } catch (e) {
    console.error("sendEmail", e);
  } finally {
    console.log("[END CRON] Send email");
  }
};
export const sendComeBackEmail = new CronJob("0 0 12 * * 6", handler);
