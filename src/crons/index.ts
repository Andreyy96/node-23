import { removeOldTokens } from "./remove-old-tokens.cron";
import { sendComeBackEmail } from "./send-grid-email-come-back.cron";
import { testCron } from "./test.cron";

export const runCronJobs = async () => {
  await testCron.start();
  await removeOldTokens.start();
  await sendComeBackEmail.start();
};
