import * as jsonwebtoken from "jsonwebtoken";

import { config } from "../configs/config";
import { ApiError } from "../errors/api-error";
import { IJwtPayload } from "../inerfaces/jwt-payload.interface";
import { ITokenResponse } from "../inerfaces/token.interface";

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

  public checkToken(token: string): IJwtPayload {
    try {
      return jsonwebtoken.verify(
        token,
        config.JWT_ACCESS_SECRET,
      ) as IJwtPayload;
    } catch (e) {
      throw new ApiError("Token is not valid", 401);
    }
  }
}

export const tokenService = new TokenService();
