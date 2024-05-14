import { CronJob } from "cron";

import { TimeHelper } from "../helpers/time.helper";
import { tokenRepository } from "../repositories/token.repository";

const handler = async () => {
  try {
    console.log("[START CRON] Remove old tokens");
    await tokenRepository.deleteByParams({
      createdAt: { $lte: TimeHelper.subtractByParams(9, "days") },
    });
  } catch (error) {
    console.error("removeOldTokens: ", error);
  } finally {
    console.log("[END CRON] Remove old tokens");
  }
};

export const removeOldTokens = new CronJob("0 0 4 * * *", handler);
