import { createMockExecutionContext } from '@root/test/mocks/guards/executionContext';
import { IDefaultPropsJwt } from '../../../jwt.core';
import { getFingerprintModule } from './getModule';

export const createDefaultSituationOnFingerprintGuard = async (
  tokenData?: IDefaultPropsJwt,
  deviceId?: string,
) => {
  const { fingerprintGuard, ...dependencies } = await getFingerprintModule();

  const mockContext = createMockExecutionContext({
    user: tokenData,
    body: {
      deviceId: deviceId ?? tokenData?.deviceId,
    },
  });

  const exec = () => fingerprintGuard.canActivate(mockContext);

  return {
    exec,
    dependencies,
  };
};
