import { FilterQuery } from "mongoose";

import { IToken } from "../interfaces/token.interface";
import { Token } from "../models/token.model";

class TokenRepository {
  public async create(dto: Partial<IToken>): Promise<IToken> {
    return await Token.create(dto);
  }
  // public async update(dto: Partial<IToken>): Promise<UpdateQuery<IToken>> {
  //   return await Token.updateOne({ _userId: dto._userId }, dto);
  // }

  public async findByParams(params: FilterQuery<IToken>): Promise<IToken> {
    return await Token.findOne(params);
  }

  public async deleteByUserId(id: string): Promise<void> {
    await Token.deleteOne({ _userId: id });
  }
}

export const tokenRepository = new TokenRepository();
