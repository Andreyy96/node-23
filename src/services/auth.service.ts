import { ApiError } from "../errors/api-error";
import { ITokenResponse } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async signUp(
    dto: Partial<IUser>,
  ): Promise<{ user: IUser; tokens: ITokenResponse }> {
    await this.isEmailExist(dto.email);
    const hashedPassword = await passwordService.hashPassword(dto.password);
    const user = await userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const tokens = tokenService.generateToken({
      userId: user._id,
      role: user.role,
    });

    await tokenRepository.create({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _userId: user._id,
    });

    return { user, tokens };
  }

  public async signIn(dto: {
    email: string;
    password: string;
  }): Promise<{ user: IUser; tokens: Partial<ITokenResponse> }> {
    const { email, password } = dto;
    const user = await userRepository.getByParams({ email });
    if (!user) {
      throw new ApiError("Wrong email or password", 401);
    }
    const isCompare = await passwordService.comparePassword(
      password,
      user.password,
    );
    if (!isCompare) {
      throw new ApiError("Wrong email or password", 401);
    }

    const tokens = await tokenRepository.findByParams({ _userId: user._id });

    if (!tokens) {
      const tokens = tokenService.generateToken({
        userId: user._id,
        role: user.role,
      });

      await tokenRepository.create({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        _userId: user._id,
      });

      return { user, tokens };
    }

    return { user, tokens };
  }

  private async isEmailExist(email: string): Promise<void> {
    const user = await userRepository.getByParams({ email });
    if (user) {
      throw new ApiError("email already exist", 409);
    }
  }
}

export const authService = new AuthService();
