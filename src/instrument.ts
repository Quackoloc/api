import * as Sentry from '@sentry/nestjs';
import * as dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://84108dbc0e06d4ac0f6cde74f3f77291@o4509491686014976.ingest.de.sentry.io/4509555991642192',

    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
  });
}
