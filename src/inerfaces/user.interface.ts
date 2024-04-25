import { RoleEnum } from "../enums/role.enum";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  age: number;
  role: RoleEnum;
  isDeleted: boolean;
  isVerified: boolean;
}
