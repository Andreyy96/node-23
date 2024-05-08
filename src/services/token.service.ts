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
        throw new ApiError(
          errorMessages.INVALID_TOKEN_TYPE,
          statusCodes.UNAUTHORIZED,
        );
      }

      return jsonwebtoken.verify(token, secret) as IJwtPayload;
    } catch (error) {
      throw new ApiError(
        errorMessages.TOKEN_IS_NOT_VALID,
        statusCodes.UNAUTHORIZED,
      );
    }
  }

  public generateActionToken(
    payload: IJwtPayload,
    type: ActionTokenTypeEnum,
  ): string {
    let secret: string;
    let expiresIn: string;

    if (type === ActionTokenTypeEnum.FORGOT) {
      secret = config.JWT_ACTION_FORGOT_TOKEN_SECRET;
      expiresIn = config.JWT_ACTION_FORGOT_EXPIRES_IN;
    } else if (type === ActionTokenTypeEnum.VERIFY) {
      secret = config.JWT_ACTION_VERIFY_SECRET;
      expiresIn = config.JWT_ACTION_VERIFY_IN;
    } else {
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

      if (type === ActionTokenTypeEnum.FORGOT) {
        secret = config.JWT_ACTION_FORGOT_TOKEN_SECRET;
      } else if (type === ActionTokenTypeEnum.VERIFY) {
        secret = config.JWT_ACTION_VERIFY_SECRET;
      } else {
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
