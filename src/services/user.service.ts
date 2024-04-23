import { ApiError } from "../api-error";
import { IUser } from "../inerfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  public async create(dto: Partial<IUser>): Promise<IUser> {
    return await userRepository.create(dto);
  }

  public async findUser(id: number): Promise<IUser> {
    const user = await userRepository.findUser(id);
    if (!user) {
      throw new ApiError("user not found", 404);
    }
    return user;
  }

  public async update(id: number, dto: Partial<IUser>): Promise<IUser> {
    const user = await userRepository.findUser(id);
    if (!user) {
      throw new ApiError("user not found", 404);
    }
    return await userRepository.update(id, dto);
  }

  public async deleteUser(id: number): Promise<void> {
    const user = await userRepository.findUser(id);
    if (!user) {
      throw new ApiError("user not found", 404);
    }
    return await userRepository.deleteUser(id);
  }
}

export const userService = new UserService();
