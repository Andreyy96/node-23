import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api-error";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new ApiError("No token provided", 401);
      }

      const tokenPair = await tokenRepository.findByParams({ accessToken });
      console.log(tokenPair);
      if (!tokenPair) {
        throw new ApiError("Invalid token", 401);
      }

      req.res.locals.jwtPayload = tokenService.checkToken(accessToken);
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
