import pino from 'pino';
import pretty from 'pino-pretty';

const logger = pino({
  transport: {
    target: 'pino-pretty',
  },
});

const loggerTest = pino(pretty({ sync: true }));

export { logger, loggerTest };
