import { GetInjectToken, NewbilityError, Singleton, UserInfo } from '@newbility/core';
import { GetAuthOptions } from '@newbility/koa-core';
import { sign } from 'jsonwebtoken';
import jwt from 'koa-jwt';

export const JWT_TOKEN_INJECT_TOKEN = GetInjectToken('Sys:Jwt:JwtToken');

export interface JwtTokenResult {
  token: string;
  expiresIn: number;
}

export interface IJwtToken {
  GetJwtToken(info: UserInfo, expiresIn?: number): JwtTokenResult;
}

@Singleton(JWT_TOKEN_INJECT_TOKEN)
export class JwtToken {
  async GetJwtToken(info: UserInfo, expiresIn?: number): Promise<JwtTokenResult> {
    const options = GetAuthOptions() as jwt.Options;
    if (!options.secret) throw new NewbilityError('Auth secret is not null');
    if (!expiresIn) expiresIn = 2 * 60 * 60;
    const token = sign(info, options.secret as string, { expiresIn: expiresIn });
    return {
      token: token,
      expiresIn: expiresIn,
    };
  }
}
