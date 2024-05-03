export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IToken extends ITokenPair {
  _id?: string;
  _userId: string;
}

export interface ITokenResponse extends ITokenPair {
  accessExpiresIn: string;
  refreshExpiresIn: string;
}
