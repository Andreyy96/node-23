import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/api-error";

class CommonMiddleware {
  public isIdValid(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      if (!isObjectIdOrHexString(userId)) {
        throw new ApiError("Invalid id", 400);
      }
      next();
    } catch (e) {
      next(e);
    }
  }

  public isReqBodyValid(validator: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = await validator.validateAsync(req.body);
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const commonMiddleware = new CommonMiddleware();
