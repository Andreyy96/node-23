import { NextFunction, Request, Response } from "express";
import Joi from "joi";

import { ApiError } from "../api-error";
import { IUser } from "../inerfaces/user.interface";

const schema: Joi.ObjectSchema<Partial<IUser>> = Joi.object({
  name: Joi.string().pattern(new RegExp("^[a-zA-Z]{3,15}$")).required(),
  email: Joi.string().email().required(),
  phone: Joi.string(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,20}$")).required(),
  age: Joi.number().min(10).max(100),
});

class ValidReqPostMiddleware {
  public async isIdValidReq(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        console.log(error.details);
        throw new ApiError(`${error.details[0].message}`, 400);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const validReqPostMiddleware = new ValidReqPostMiddleware();
