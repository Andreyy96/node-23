import { sendComeBackEmail } from "./nodemailer-send-email";
import { removeOldTokens } from "./remove-old-tokens.cron";
import { testCron } from "./test.cron";

export const runCronJobs = async () => {
  await testCron.start();
  await removeOldTokens.start();
  await sendComeBackEmail.start();
};
