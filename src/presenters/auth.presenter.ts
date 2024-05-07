import { ITokenResponse } from "../interfaces/token.interface";
import { IPrivateUser, IUser } from "../interfaces/user.interface";
import { UserPresenter } from "./user.presenter";

export class AuthPresenter {
  public static toResponseDto(data: { user: IUser; tokens: ITokenResponse }): {
    user: IPrivateUser;
    tokens: ITokenResponse;
  } {
    return {
      user: UserPresenter.toPrivateResponseDto(data.user),
      tokens: data.tokens,
    };
  }
}
