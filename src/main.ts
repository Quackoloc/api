import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as cookieParser from 'cookie-parser';
import { ExceptionHandler } from './app/exception-handler';

async function bootstrap() {
  const winstonConfig = {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
      ],
    }),
  };

  const app = await NestFactory.create(AppModule, winstonConfig);

  const config = new DocumentBuilder()
    .setTitle('Quackoloc API')
    .setDescription('API documentation for Quackoloc')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ExceptionHandler());
  app.use(cookieParser());
  app.use(helmet());

  app.enableCors({
    origin: ['http://localhost:5173', 'https://app.quackoloc.fr'],
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
