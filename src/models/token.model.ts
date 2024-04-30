import mongoose, { Types } from "mongoose";

import { IToken } from "../inerfaces/token.interface";
import { User } from "./user.module";

const tokenSchema = new mongoose.Schema(
  {
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },

    _userId: { type: Types.ObjectId, required: true, ref: User },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Token = mongoose.model<IToken>("tokens", tokenSchema);
