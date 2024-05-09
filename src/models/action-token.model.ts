import mongoose, { Types } from "mongoose";

import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { IActionToken } from "../interfaces/action-token.interface";
import { User } from "./user.module";

const tokenSchema = new mongoose.Schema(
  {
    actionToken: { type: String, required: true },
    tokenType: { type: String, required: true, enum: ActionTokenTypeEnum },

    _userId: { type: Types.ObjectId, required: true, ref: User },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ActionToken = mongoose.model<IActionToken>(
  "action-tokens",
  tokenSchema,
);
