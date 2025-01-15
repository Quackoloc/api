import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { localConf } from './config/database.config';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionHandler } from '@nestjs/core/errors/exception-handler';
import { ColocationsModule } from './modules/colocations/colocations.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import * as promClient from 'prom-client';
import { HttpMetricsMiddleware } from './common/middlewares/http-metrics.middleware';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: localConf,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ColocationsModule,
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionHandler,
    },
    {
      provide: 'PROM_METRIC_HTTP_REQUESTS_TOTAL',
      useValue: new promClient.Counter({
        name: 'http_requests_total',
        help: 'Total number of HTTP requests',
        labelNames: ['method', 'route', 'status'],
      }),
    },
    {
      provide: 'PROM_METRIC_HTTP_REQUEST_DURATION_SECONDS',
      useValue: new promClient.Histogram({
        name: 'http_request_duration_seconds',
        help: 'HTTP request duration in seconds',
        labelNames: ['method', 'route', 'status'],
        buckets: [0.1, 0.5, 1, 3, 5, 10],
      }),
    },
  ],
  exports: ['PROM_METRIC_HTTP_REQUESTS_TOTAL', 'PROM_METRIC_HTTP_REQUEST_DURATION_SECONDS'],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpMetricsMiddleware).forRoutes('*'); // Applique à toutes les routes
  }
}
