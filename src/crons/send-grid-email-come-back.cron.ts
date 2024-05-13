import { CronJob } from "cron";

import { EmailTypeEnum } from "../enums/email-type.enum";
import { TimeHelper } from "../helpers/time.helper";
import { userRepository } from "../repositories/user.repository";
import { sendGridService } from "../services/send-grid.service";

const handler = async () => {
  try {
    console.log("[START CRON] send email");
    const date = TimeHelper.subtractByParams(1, "day");
    const users = await userRepository.findWithOutActivityAfter(date);
    await Promise.all(
      users.map(async (user) => {
        console.log(user);
        return await sendGridService.sendByType(
          user.email,
          EmailTypeEnum.COME_BACK,
          { name: user.name },
        );
      }),
    );
  } catch (error) {
    console.error("notifyOldVisitors: ", error);
  } finally {
    console.log("[END CRON] send email");
  }
};

export const sendComeBackEmail = new CronJob("* * * 4 * *", handler);
