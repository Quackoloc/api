import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  getRoot() {
    return { status: 'ok', message: 'API is running' };
  }

  @Public()
  @Get('debug-sentry')
  getError() {
    throw new Error('My first Sentry error!');
  }
}
