import { NextFunction, Request, Response } from "express";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../api-error";
import { schemaForPostUser, schemaForPutUser } from "../user.validator";

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

  public isReqBodyValid(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } =
        req.method === "POST"
          ? schemaForPostUser.validate(req.body)
          : schemaForPutUser.validate(req.body);
      if (error) {
        throw new ApiError(`${error.details[0].message}`, 400);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const commonMiddleware = new CommonMiddleware();
