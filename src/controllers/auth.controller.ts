import { NextFunction, Request, Response } from "express";

import { statusCodes } from "../constants/status-codes.constant";
import { IForgot, ISetForgot } from "../interfaces/action-token.interface";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { IToken } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { AuthPresenter } from "../presenters/auth.presenter";
import { UserPresenter } from "../presenters/user.presenter";
import { authService } from "../services/auth.service";

class AuthController {
  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as Partial<IUser>;
      const data = await authService.signUp(dto);

      res.status(statusCodes.CREATED).json(AuthPresenter.toResponseDto(data));
    } catch (e) {
      next(e);
    }
  }

  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as { email: string; password: string };
      const data = await authService.signIn(dto);

      res.status(statusCodes.CREATED).json(AuthPresenter.toResponseDto(data));
    } catch (e) {
      next(e);
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJwtPayload;
      const tokenPair = req.res.locals.tokenPair as IToken;

      const data = await authService.refresh(jwtPayload, tokenPair);

      res.status(statusCodes.CREATED).json(data);
    } catch (e) {
      next(e);
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as IForgot;
      await authService.forgotPassword(body);
      res.sendStatus(statusCodes.NO_CONTENT);
    } catch (e) {
      next(e);
    }
  }

  public async setForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const body = req.body as ISetForgot;
      const jwtPayload = req.res.locals.jwtPayload as IJwtPayload;
      await authService.setForgotPassword(body, jwtPayload);
      res.sendStatus(statusCodes.NO_CONTENT);
    } catch (e) {
      next(e);
    }
  }

  public async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJwtPayload;
      const user = await authService.verify(jwtPayload);

      res
        .status(statusCodes.CREATED)
        .json(UserPresenter.toPrivateResponseDto(user));
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
