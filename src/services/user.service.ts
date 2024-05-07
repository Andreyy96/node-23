import { config } from "../configs/config";
import { errorMessages } from "../constants/error-messages.constant";
import { statusCodes } from "../constants/status-codes.constant";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "./email.service";

class UserService {
  private async check(id: string): Promise<IUser> {
    const user = await userRepository.findUser(id);
    if (!user) {
      throw new ApiError(errorMessages.USER_NOT_FOUND, statusCodes.NOT_FOUND);
    }
    return user;
  }

  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  public async findUser(id: string): Promise<IUser> {
    return await this.check(id);
  }

  public async findMe(id: string): Promise<IUser> {
    return await this.check(id);
  }

  public async updateMe(id: string, dto: Partial<IUser>): Promise<IUser> {
    await this.check(id);
    return await userRepository.updateById(id, dto);
  }

  public async deleteMe(id: string, user: IUser): Promise<void> {
    await this.check(id);
    await emailService.sendByType(user.email, EmailTypeEnum.DELETE_ACCOUNT, {
      frontUrl: config.FRONT_URL,
    });
    await userRepository.updateById(id, { isDeleted: true });
  }
}

export const userService = new UserService();
