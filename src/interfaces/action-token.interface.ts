import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { IUser } from "./user.interface";

export interface IForgot extends Pick<IUser, "email"> {}
export interface ISetForgot extends Pick<IUser, "password"> {}

export interface IActionToken {
  _id?: string;
  actionToken: string;
  tokenType: ActionTokenTypeEnum;
  _userId: string;
}
