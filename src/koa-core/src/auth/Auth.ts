import { Container, Singleton, GetInjectToken } from '@newbility/core';

export const AUTH_INJECT_TOKEN = GetInjectToken('Sys:Auth:Auth');
export const AUTH_OPTIONS_INJECT_TOKEN = GetInjectToken('Sys:Auth:AuthOptions');

export interface IAuth {
  UseAuth(options?: any): void;
}

@Singleton(AUTH_INJECT_TOKEN)
export class JwtAuth implements IAuth {
  UseAuth(options?: any): void {
    if (!options) options = {};
    Container.registerInstance(AUTH_OPTIONS_INJECT_TOKEN, options);
  }
}

export function GetAuthOptions(): any | null {
  try {
    const options = Container.resolve(AUTH_OPTIONS_INJECT_TOKEN);
    return options;
  } catch {
    return null;
  }
}
