import { FilterQuery, UpdateQuery } from "mongoose";

import { IToken } from "../interfaces/token.interface";
import { ActionToken } from "../models/action-token.model";
import { Token } from "../models/token.model";

class TokenRepository {
  public async create(dto: Partial<IToken>): Promise<IToken> {
    return await Token.create(dto);
  }
  public async update(dto: Partial<IToken>): Promise<UpdateQuery<IToken>> {
    return await Token.updateOne({ _userId: dto._userId }, dto);
  }

  public async findByParams(params: FilterQuery<IToken>): Promise<IToken> {
    return await Token.findOne(params);
  }

  public async deleteByParams(params: FilterQuery<IToken>): Promise<void> {
    await ActionToken.deleteMany(params);
  }

  public async deleteById(id: string): Promise<void> {
    await Token.deleteOne({ _id: id });
  }
}

export const tokenRepository = new TokenRepository();
