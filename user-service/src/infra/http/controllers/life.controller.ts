import { Controller, Get } from '@nestjs/common';
import { logger } from '@root/src/config/logger';

@Controller('life')
export class LifeController {
  @Get()
  exec() {
    if (process.env.NODE_ENV === 'development')
      logger.info('Everything is OK!');
  }
}
