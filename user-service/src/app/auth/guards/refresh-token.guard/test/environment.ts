import { createMockExecutionContext } from '@root/test/mocks/guards/executionContext';
import { IDefaultPropsJwt } from '../../../jwt.core';
import { getRefreshTokenGuardModule } from './getModule';

export const createDefaultSituationOnRTGuard = async (
  tokenContent: string,
  token: IDefaultPropsJwt,
) => {
  const { refreshTokenGuard, ...dependencies } =
    await getRefreshTokenGuardModule();
  await dependencies.tokenHandler.sendToken({
    id: token.sub,
    type: token.type,
    content:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZWZhdWx0IGlkIiwiZW1haWwiOiJkZWZhdWx0QGVtYWlsLmNvbSIsInR5cGUiOiJyZWZyZXNoX3Rva2VuIiwiZGV2aWNlSWQiOiIkMmIkMTAkVWh1cXc4U3FsbVFRT3RXUGpPb0J5Lk1BVDMwZEsySHRmSVM3UC9iQXA4ekh5QWNXYXozdzIiLCJpYXQiOjE2ODk2MzU3NTksImV4cCI6MTY4OTcyMjE1OX0.2toUmdNhTJ_oEwTWUIxdpvKxxHFVQlG8EpYjokcF9eE',
    expiresIn: token.iat,
  });

  const executionContextMock = createMockExecutionContext({
    headers: {
      cookie: `refresh-cookie=${tokenContent}`,
    },
  });

  const exec = () => refreshTokenGuard.canActivate(executionContextMock);

  return {
    exec,
    dependencies,
  };
};
