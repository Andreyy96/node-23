import { FilterQuery } from "mongoose";

import { IToken } from "../inerfaces/token.interface";
import { Token } from "../models/token.model";

class TokenRepository {
  public async create(dto: Partial<IToken>): Promise<IToken> {
    return await Token.create(dto);
  }

  public async findByParams(params: FilterQuery<IToken>): Promise<IToken> {
    return await Token.findOne(params);
  }
}

export const tokenRepository = new TokenRepository();
