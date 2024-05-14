import { config } from "../configs/config";
import { IPrivateUser, IPublicUser, IUser } from "../interfaces/user.interface";

export class UserPresenter {
  public static toPublicResponseDto(user: IUser): IPublicUser {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      role: user.role,
      avatar: user.avatar ? `${config.AWS_S3_ENDPOINT}/${user.avatar}` : null,
      isDeleted: user.isDeleted,
      isVerified: user.isVerified,
    };
  }

  public static toPrivateResponseDto(user: IUser): IPrivateUser {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      age: user.age,
      role: user.role,
      avatar: user.avatar ? `${config.AWS_S3_ENDPOINT}/${user.avatar}` : null,
      isDeleted: user.isDeleted,
      isVerified: user.isVerified,
    };
  }

  public static toPublicResponseListDto(users: IUser[]): IPublicUser[] {
    return users.map(UserPresenter.toPublicResponseDto);
  }
}
