import { NextFunction, Request, Response } from "express";

import { TokenTypeEnum } from "../enums/token-type.enum";
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

      if (!tokenPair) {
        throw new ApiError("Invalid token", 401);
      }

      req.res.locals.jwtPayload = tokenService.checkToken(
        accessToken,
        TokenTypeEnum.ACCESS,
      );
      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const refreshToken = req.headers.authorization;
      if (!refreshToken) {
        throw new ApiError("No token provided", 401);
      }

      const tokenPair = await tokenRepository.findByParams({ refreshToken });

      if (!tokenPair) {
        throw new ApiError("Invalid token", 401);
      }

      req.res.locals.jwtPayload = tokenService.checkToken(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );
      req.res.locals.tokenPair = tokenPair;
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
