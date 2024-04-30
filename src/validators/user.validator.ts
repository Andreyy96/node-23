import Joi from "joi";

import { regexConstant } from "../constants/regex.constant";
import { IUser } from "../interfaces/user.interface";

export class UserValidator {
  public static schemaForPutUser: Joi.ObjectSchema<Partial<IUser>> = Joi.object(
    {
      name: Joi.string().min(3).max(50).trim(),
      phone: Joi.string().regex(regexConstant.PHONE).trim(),
      age: Joi.number().min(18).max(100),
    },
  );
}
