import { Controller, Get } from '@nestjs/common';

@Controller('life')
export class LifeController {
  @Get()
  exec() {}
}
