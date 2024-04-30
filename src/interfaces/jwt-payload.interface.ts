import { RoleEnum } from "../enums/role.enum";

export interface IJwtPayload {
  userId: string;
  role: RoleEnum;
}
