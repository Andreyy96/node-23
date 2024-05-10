import { config } from "../configs/config";
import { errorMessages } from "../constants/error-messages.constant";
import { statusCodes } from "../constants/status-codes.constant";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { ApiError } from "../errors/api-error";
import { IForgot, ISetForgot } from "../interfaces/action-token.interface";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { IToken, ITokenResponse } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { sendGridService } from "./send-grid.service";
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

    const actionToken = tokenService.generateActionToken(
      { userId: user._id, role: user.role },
      ActionTokenTypeEnum.VERIFY,
    );

    await actionTokenRepository.create({
      _userId: user._id,
      actionToken,
      tokenType: ActionTokenTypeEnum.VERIFY,
    });

    await Promise.all([
      sendGridService.sendByType(user.email, EmailTypeEnum.WELCOME, {
        name: dto.name,
        frontUrl: config.FRONT_URL,
        actionToken,
      }),
    ]);

    return { user, tokens };
  }

  public async signIn(dto: {
    email: string;
    password: string;
  }): Promise<{ user: IUser; tokens: ITokenResponse }> {
    const user = await userRepository.getByParams({ email: dto.email });
    if (!user) {
      throw new ApiError(
        errorMessages.WRONG_EMAIL_OR_PASSWORD,
        statusCodes.UNAUTHORIZED,
      );
    }
    const isCompare = await passwordService.comparePassword(
      dto.password,
      user.password,
    );
    if (!isCompare) {
      throw new ApiError(
        errorMessages.WRONG_EMAIL_OR_PASSWORD,
        statusCodes.UNAUTHORIZED,
      );
    }
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

  public async refresh(
    jwtPayload: IJwtPayload,
    oldPair: IToken,
  ): Promise<ITokenResponse> {
    const newPair = tokenService.generateToken({
      userId: jwtPayload.userId,
      role: jwtPayload.role,
    });

    await tokenRepository.deleteById(oldPair._id);
    await tokenRepository.create({
      ...newPair,
      _userId: jwtPayload.userId,
    });
    return newPair;
  }

  public async forgotPassword(dto: IForgot): Promise<void> {
    const user = await userRepository.getByParams({ email: dto.email });

    if (!user) return;

    const actionToken = tokenService.generateActionToken(
      { userId: user._id, role: user.role },
      ActionTokenTypeEnum.FORGOT,
    );

    await actionTokenRepository.create({
      _userId: user._id,
      actionToken,
      tokenType: ActionTokenTypeEnum.FORGOT,
    });

    await sendGridService.sendByType(user.email, EmailTypeEnum.RESET_PASSWORD, {
      actionToken,
      frontUrl: config.FRONT_URL,
    });
  }

  public async setForgotPassword(
    dto: ISetForgot,
    jwtPayload: IJwtPayload,
  ): Promise<void> {
    const user = await userRepository.findUser(jwtPayload.userId);
    const hashedPassword = await passwordService.hashPassword(dto.password);

    await userRepository.updateById(user._id, { password: hashedPassword });
    await actionTokenRepository.deleteByParams({
      tokenType: ActionTokenTypeEnum.FORGOT,
    });
    await tokenRepository.deleteByParams({ _userId: user._id });
  }

  public async verify(dto: IJwtPayload): Promise<IUser> {
    const [user] = await Promise.all([
      userRepository.updateById(dto.userId, { isVerified: true }),
      actionTokenRepository.deleteByParams({
        tokenType: ActionTokenTypeEnum.VERIFY,
      }),
    ]);

    return user;
  }

  private async isEmailExist(email: string): Promise<void> {
    const user = await userRepository.getByParams({ email });
    if (user) {
      throw new ApiError(
        errorMessages.EMAIL_ALREADY_EXIST,
        statusCodes.CONFLICT,
      );
    }
  }
}

export const authService = new AuthService();
