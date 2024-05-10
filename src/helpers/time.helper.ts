import dayjs, { ManipulateType } from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export class TimeHelper {
  public static subtractByParams(value: number, unit: ManipulateType) {
    return dayjs().subtract(value, unit).toDate();
  }
}
