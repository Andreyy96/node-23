import Joi from "joi";

import { regexConstant } from "../constants/regex.constant";
import { IUser } from "../inerfaces/user.interface";

export class UserValidator {
  public static schemaForPostUser: Joi.ObjectSchema<Partial<IUser>> =
    Joi.object({
      name: Joi.string().min(3).max(50).trim().required(),
      email: Joi.string()
        .regex(regexConstant.EMAIL)
        .lowercase()
        .trim()
        .required(),
      phone: Joi.string().regex(regexConstant.PHONE).trim(),
      password: Joi.string().regex(regexConstant.PASSWORD).trim().required(),
      age: Joi.number().min(18).max(100),
    });

  public static schemaForPutUser: Joi.ObjectSchema<Partial<IUser>> = Joi.object(
    {
      name: Joi.string().min(3).max(50).trim(),
      phone: Joi.string().regex(regexConstant.PHONE).trim(),
      age: Joi.number().min(18).max(100),
    },
  );
}
