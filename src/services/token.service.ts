import * as jsonwebtoken from "jsonwebtoken";

import { config } from "../configs/config";
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
}

export const tokenService = new TokenService();
