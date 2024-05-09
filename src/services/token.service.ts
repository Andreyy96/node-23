import * as jsonwebtoken from "jsonwebtoken";

import { config } from "../configs/config";
import { errorMessages } from "../constants/error-messages.constant";
import { statusCodes } from "../constants/status-codes.constant";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { ITokenResponse } from "../interfaces/token.interface";

class TokenService {
  public generateToken(payload: IJwtPayload): ITokenResponse {
    const accessToken = jsonwebtoken.sign(payload, config.JWT_ACCESS_SECRET, {
      expiresIn: config.JWT_ACCESS_EXPIRES_IN,
    });
    const refreshToken = jsonwebtoken.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    });

    return {
      accessToken,
      accessExpiresIn: config.JWT_ACCESS_EXPIRES_IN,
      refreshToken,
      refreshExpiresIn: config.JWT_REFRESH_EXPIRES_IN,
    };
  }

  public checkToken(token: string, type: TokenTypeEnum): IJwtPayload {
    try {
      let secret: string;

      if (type === TokenTypeEnum.ACCESS) {
        secret = config.JWT_ACCESS_SECRET;
      } else if (type === TokenTypeEnum.REFRESH) {
        secret = config.JWT_REFRESH_SECRET;
      } else {
        throw new ApiError("Invalid token type", 401);
      }

      return jsonwebtoken.verify(token, secret) as IJwtPayload;
    } catch (error) {
      throw new ApiError("Token is not valid", 401);
    }
  }

  public generateActionToken(
    payload: IJwtPayload,
    type: ActionTokenTypeEnum,
  ): string {
    let secret: string;
    let expiresIn: string;

    switch (type) {
      case ActionTokenTypeEnum.FORGOT:
        secret = config.JWT_ACTION_FORGOT_TOKEN_SECRET;
        expiresIn = config.JWT_ACTION_FORGOT_EXPIRES_IN;
        break;
      case ActionTokenTypeEnum.VERIFY:
        secret = config.JWT_ACTION_VERIFY_SECRET;
        expiresIn = config.JWT_ACTION_VERIFY_EXPIRES_IN;
      default:
        throw new ApiError(
          errorMessages.INVALID_TOKEN_TYPE,
          statusCodes.INTERNAL_SERVER_ERROR,
        );
    }
    return jsonwebtoken.sign(payload, secret, { expiresIn });
  }

  public checkActionToken(
    token: string,
    type: ActionTokenTypeEnum,
  ): IJwtPayload {
    try {
      let secret: string;

      switch (type) {
        case ActionTokenTypeEnum.FORGOT:
          secret = config.JWT_ACTION_FORGOT_TOKEN_SECRET;
          break;

        case ActionTokenTypeEnum.VERIFY:
          secret = config.JWT_ACTION_VERIFY_SECRET;
          break;

        default:
          throw new ApiError(
            errorMessages.INVALID_TOKEN_TYPE,
            statusCodes.INTERNAL_SERVER_ERROR,
          );
      }

      return jsonwebtoken.verify(token, secret) as IJwtPayload;
    } catch (error) {
      throw new ApiError("Token is not valid", statusCodes.UNAUTHORIZED);
    }
  }
}

export const tokenService = new TokenService();
