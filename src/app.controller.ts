import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  get() {
    return { status: 'ok', message: 'API is running !' };
  }
}
