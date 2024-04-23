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
    return await userRepository.findUser(id);
  }

  public async update(id: number, dto: Partial<IUser>): Promise<IUser> {
    return await userRepository.update(id, dto);
  }

  public async deleteUser(id: number): Promise<void> {
    await userRepository.deleteUser(id);
  }
}

export const userService = new UserService();
