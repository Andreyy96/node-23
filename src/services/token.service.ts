import * as jsonwebtoken from "jsonwebtoken";

import { config } from "../configs/config";
import { ApiError } from "../errors/api-error";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { ITokenResponse } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";

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

  public checkAccessToken(token: string): IJwtPayload {
    try {
      return jsonwebtoken.verify(
        token,
        config.JWT_ACCESS_SECRET,
      ) as IJwtPayload;
    } catch (e) {
      throw new ApiError("Token is not valid", 401);
    }
  }

  public checkRefreshToken(token: string): IJwtPayload {
    try {
      return jsonwebtoken.verify(
        token,
        config.JWT_REFRESH_SECRET,
      ) as IJwtPayload;
    } catch (e) {
      throw new ApiError("Token is not valid", 401);
    }
  }

  public async refresh(
    refreshToken: string,
  ): Promise<{ user: IUser; tokens: ITokenResponse }> {
    const { _userId } = await tokenRepository.findByParams({ refreshToken });

    const user = await userRepository.findUser(_userId);

    const tokens = tokenService.generateToken({
      userId: user._id,
      role: user.role,
    });

    await tokenRepository.deleteByUserId(_userId);

    await tokenRepository.create({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _userId: user._id,
    });
    return { user, tokens };
  }
}

export const tokenService = new TokenService();
