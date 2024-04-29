import { ApiError } from "../errors/api-error";
import { IUser } from "../inerfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
  private async check(id: string): Promise<IUser> {
    const user = await userRepository.findUser(id);
    if (!user) {
      throw new ApiError("user not found", 404);
    }
    return user;
  }

  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  public async create(dto: Partial<IUser>): Promise<IUser> {
    await this.isEmailExist(dto.email);
    return await userRepository.create(dto);
  }

  public async findUser(id: string): Promise<IUser> {
    return await this.check(id);
  }

  public async update(id: string, dto: Partial<IUser>): Promise<IUser> {
    await this.check(id);
    return await userRepository.update(id, dto);
  }

  private async isEmailExist(email: string): Promise<void> {
    const user = await userRepository.getByParams({ email });
    if (user) {
      throw new ApiError("email already exist", 409);
    }
  }

  public async deleteUser(id: string): Promise<void> {
    await this.check(id);
    return await userRepository.deleteUser(id);
  }
}

export const userService = new UserService();
