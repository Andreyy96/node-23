import { CronJob } from "cron";

import { config } from "../configs/config";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { TimeHelper } from "../helpers/time.helper";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "../services/email.service";

const handler = async () => {
  try {
    console.log("[START CRON] send email");
    const date = TimeHelper.subtractByParams(1, "day");
    const users = await userRepository.findWithOutActivityAfter(date);
    await Promise.all(
      users.map(async (user) => {
        console.log(user);
        return await emailService.sendByType(
          user.email,
          EmailTypeEnum.COME_BACK,
          { name: user.name, frontUrl: config.FRONT_URL },
        );
      }),
    );
  } catch (error) {
    console.error("notifyOldVisitors: ", error);
  } finally {
    console.log("[END CRON] send email");
  }
};

export const sendComeBackEmail = new CronJob("* * 4 * * *", handler);
