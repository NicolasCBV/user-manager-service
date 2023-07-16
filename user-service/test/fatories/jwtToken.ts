import { IDefaultPropsJwt } from "@app/auth/jwt.core";
import { randomUUID } from "crypto";

type Override = Partial<IDefaultPropsJwt>;

export function tokenFactory(input?: Override): IDefaultPropsJwt {
  return {
    sub: randomUUID(),
    email: 'default@email.com',
    iat: Date.now(),
    exp: Date.now() + 10000,
    type: 'access_token',
    deviceId: 'hashed id',
    ...input
  }
}
