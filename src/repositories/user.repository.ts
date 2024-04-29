import { IUser } from "../inerfaces/user.interface";
import { User } from "../models/user.module";

class UserRepository {
  public async getList(): Promise<IUser[]> {
    return await User.find({});
  }

  public async create(dto: Partial<IUser>): Promise<IUser> {
    return await User.create(dto);
  }

  public async findUser(id: string): Promise<IUser> {
    return await User.findById(id);
  }

  public async update(id: string, dto: Partial<IUser>): Promise<IUser> {
    return await User.findByIdAndUpdate(id, dto, {
      returnDocument: "after",
    });
  }

  public async deleteUser(id: string): Promise<void> {
    await User.deleteOne({ _id: id });
  }

  public async getByParams(params: Partial<IUser>): Promise<IUser> {
    return await User.findOne(params);
  }
}

export const userRepository = new UserRepository();
