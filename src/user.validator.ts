import Joi from "joi";

import { IUser } from "./inerfaces/user.interface";

const schemaForPostUser: Joi.ObjectSchema<Partial<IUser>> = Joi.object({
  name: Joi.string().pattern(new RegExp("^[a-zA-Z]{3,15}$")).required(),
  email: Joi.string().email().required(),
  phone: Joi.string(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,20}$")).required(),
  age: Joi.number().min(10).max(100),
});

const schemaForPutUser: Joi.ObjectSchema<Partial<IUser>> = Joi.object({
  name: Joi.string().pattern(new RegExp("^[a-zA-Z]{3,15}$")),
  email: Joi.string().email(),
  phone: Joi.string(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,20}$")),
  age: Joi.number().min(10).max(100),
});

export { schemaForPostUser, schemaForPutUser };
