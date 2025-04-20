import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class HttpMetricsMiddleware implements NestMiddleware {
  constructor(
    @Inject('PROM_METRIC_HTTP_REQUESTS_TOTAL') private readonly counter: Counter<string>,
    @Inject('PROM_METRIC_HTTP_REQUEST_DURATION_SECONDS')
    private readonly histogram: Histogram<string>
  ) {}

  use(req: any, res: any, next: () => void) {
    const end = this.histogram.startTimer({ method: req.method, route: req.originalUrl });

    res.on('finish', () => {
      this.counter.inc({ method: req.method, route: req.originalUrl, status: res.statusCode });
      end({ status: res.statusCode });
    });

    next();
  }
}
