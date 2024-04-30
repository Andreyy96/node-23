import mongoose from "mongoose";

import { RoleEnum } from "../enums/role.enum";
import { IUser } from "../interfaces/user.interface";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      pattern: new RegExp("^[a-zA-Z]{3,15}$"),
    },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    password: {
      type: String,
      required: true,
      pattern: new RegExp("^[a-zA-Z0-9]{3,20}$"),
    },
    age: { type: Number, required: false, min: 10, max: 100 },
    role: { type: String, enum: RoleEnum, default: RoleEnum.USER },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = mongoose.model<IUser>("users", userSchema);
