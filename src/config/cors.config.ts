import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ENV } from './env';

const corsOptions: CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    ...(ENV.ALLOWED_HEADERS
      ? (ENV.ALLOWED_HEADERS as string).split(',').map((h) => h.trim())
      : []),
  ],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

export default corsOptions;
