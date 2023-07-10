import { Controller, Get } from '@nestjs/common';
import { logger } from '@root/src/config/logger';

@Controller('life')
export class LifeController {
  @Get()
  exec() {
    logger.info('Everything is OK!');
  }
}
