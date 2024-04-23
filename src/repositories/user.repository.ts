import fs from "node:fs/promises";
import path from "node:path";

import { ApiError } from "../api-error";
import { IUser } from "../inerfaces/user.interface";

class UserRepository {
  private reader = async (): Promise<IUser[]> => {
    const users = await fs.readFile(
      path.join(process.cwd(), "db.json"),
      "utf-8",
    );
    return JSON.parse(users);
  };

  private writer = async (users: IUser[]): Promise<void> => {
    await fs.writeFile(
      path.join(process.cwd(), "db.json"),
      JSON.stringify(users),
    );
  };

  public async getList(): Promise<IUser[]> {
    return await this.reader();
  }

  public async create(dto: Partial<IUser>): Promise<IUser> {
    const { name, email, password } = dto;

    const users: IUser[] = await this.reader();

    const newUser: IUser = {
      id: users[users.length - 1].id + 1,
      name,
      email,
      password,
    };

    users.push(newUser);
    await this.writer(users);
    return newUser;
  }

  public async findUser(id: number): Promise<IUser> {
    const users = await this.reader();
    const user = users.find((user) => user.id === +id);

    if (!user) {
      throw new ApiError("user not found", 404);
    }

    return user;
  }

  public async update(id: number, dto: Partial<IUser>) {
    const { name, email, password } = dto;
    const users: IUser[] = await this.reader();
    const userIndex: number = users.findIndex((user) => user.id === +id);

    if (userIndex === -1) {
      throw new ApiError("user not found", 404);
    }

    users[userIndex] = { ...users[userIndex], name, email, password };
    await this.writer(users);
    return users[userIndex];
  }

  public async deleteUser(id: number) {
    const users: IUser[] = await this.reader();
    const userIndex: number = users.findIndex((user) => user.id === +id);

    if (!userIndex || userIndex === -1) {
      throw new ApiError("user not found", 404);
    }

    users.splice(userIndex, 1);
    await this.writer(users);
  }
}

export const userRepository = new UserRepository();
