import { EmailCombinedPayloadType } from "../types/email-combined-payload.type";
import { PickRequired } from "../types/pick-required.type";

export interface IMailOptions {
  to: string;
  subject: string;
  template: string;
  context: PickRequired<EmailCombinedPayloadType, any>;
}
