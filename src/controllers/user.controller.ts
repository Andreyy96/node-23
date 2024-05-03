import { NextFunction, Request, Response } from "express";

import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { IUser } from "../interfaces/user.interface";
import { userService } from "../services/user.service";

class UserController {
  public async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const users: IUser[] = await userService.getList();
      res.json(users);
    } catch (e) {
      next(e);
    }
  }

  public async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.findUser(id);

      res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  }

  public async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJwtPayload;
      const user = await userService.findMe(jwtPayload.userId);

      res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  }

  public async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJwtPayload;
      const dto = req.body as Partial<IUser>;
      const updateUser = await userService.updateMe(jwtPayload.userId, dto);

      res.status(200).json(updateUser);
    } catch (e) {
      next(e);
    }
  }

  public async deleteMe(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJwtPayload;
      await userService.deleteMe(jwtPayload.userId);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
