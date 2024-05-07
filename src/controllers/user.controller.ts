import { NextFunction, Request, Response } from "express";

import { statusCodes } from "../constants/status-codes.constant";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { IUser } from "../interfaces/user.interface";
import { UserPresenter } from "../presenters/user.presenter";
import { userService } from "../services/user.service";

class UserController {
  public async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const users: IUser[] = await userService.getList();
      res.json(UserPresenter.toPublicResponseListDto(users));
    } catch (e) {
      next(e);
    }
  }

  public async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.findUser(id);
      res.status(statusCodes.OK).json(UserPresenter.toPublicResponseDto(user));
    } catch (e) {
      next(e);
    }
  }

  public async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJwtPayload;
      const user = await userService.findMe(jwtPayload.userId);

      res.status(statusCodes.OK).json(UserPresenter.toPrivateResponseDto(user));
    } catch (e) {
      next(e);
    }
  }

  public async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJwtPayload;
      const dto = req.body as Partial<IUser>;
      const updateUser = await userService.updateMe(jwtPayload.userId, dto);

      res
        .status(statusCodes.OK)
        .json(UserPresenter.toPrivateResponseDto(updateUser));
    } catch (e) {
      next(e);
    }
  }

  public async deleteMe(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJwtPayload;
      const user = await userService.findMe(jwtPayload.userId);
      await userService.deleteMe(jwtPayload.userId, user);
      res.sendStatus(statusCodes.NO_CONTENT);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
