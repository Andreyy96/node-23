import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { avatarConfig } from "../constants/file.constant";
import { statusCodes } from "../constants/status-codes.constant";
import { ApiError } from "../errors/api-error";

class FileMiddleware {
  public isAvatarValid(req: Request, res: Response, next: NextFunction) {
    try {
      const avatar = req.files?.avatar as UploadedFile;
      if (!avatar) {
        throw new ApiError("Empty file", statusCodes.BAD_REQUEST);
      }
      if (Array.isArray(avatar)) {
        throw new ApiError("Must be not array", statusCodes.BAD_REQUEST);
      }
      if (!avatarConfig.MIMETYPE.includes(avatar.mimetype)) {
        throw new ApiError("Invalid file format", statusCodes.BAD_REQUEST);
      }
      if (avatar.size > avatarConfig.MAX_SIZE) {
        throw new ApiError("File is too large", statusCodes.BAD_REQUEST);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const fileMiddleware = new FileMiddleware();
