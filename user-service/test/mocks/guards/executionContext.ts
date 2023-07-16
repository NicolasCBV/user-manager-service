import { ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';


export const createMockExecutionContext = (request: any): ExecutionContext => {
  const httpArgumentsHost = {
    getRequest: () => request,
  } as HttpArgumentsHost

  return {
    switchToHttp: () => httpArgumentsHost
  } as ExecutionContext;
}
