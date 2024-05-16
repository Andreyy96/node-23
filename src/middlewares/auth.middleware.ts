import { NextFunction, Request, Response } from "express";

import { errorMessages } from "../constants/error-messages.constant";
import { statusCodes } from "../constants/status-codes.constant";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { actionTokenRepository } from "../repositories/action-token.repository";
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
        throw new ApiError(
          errorMessages.NO_TOKEN_PROVIDER,
          statusCodes.UNAUTHORIZED,
        );
      }

      const tokenPair = await tokenRepository.findByParams({ accessToken });

      if (!tokenPair) {
        throw new ApiError(
          errorMessages.INVALID_TOKEN,
          statusCodes.UNAUTHORIZED,
        );
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
        throw new ApiError(
          errorMessages.NO_TOKEN_PROVIDER,
          statusCodes.BAD_REQUEST,
        );
      }

      const tokenPair = await tokenRepository.findByParams({ refreshToken });

      if (!tokenPair) {
        throw new ApiError(
          errorMessages.INVALID_TOKEN,
          statusCodes.UNAUTHORIZED,
        );
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

  public checkActionToken(type: ActionTokenTypeEnum, key = "token") {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const actionToken = req.query[key] as string;
        if (!actionToken) {
          throw new ApiError(
            errorMessages.NO_TOKEN_PROVIDER,
            statusCodes.BAD_REQUEST,
          );
        }
        const payload = tokenService.checkActionToken(actionToken, type);

        const entity = await actionTokenRepository.findByParams({
          actionToken,
        });
        if (!entity) {
          throw new ApiError(
            errorMessages.INVALID_TOKEN,
            statusCodes.UNAUTHORIZED,
          );
        }
        req.res.locals.jwtPayload = payload;
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const authMiddleware = new AuthMiddleware();
