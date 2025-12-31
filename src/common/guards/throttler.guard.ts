import { ThrottlerModule } from '@nestjs/throttler';

export const throttlerGuard = ThrottlerModule.forRoot([
  {
    name: 'short',
    ttl: 2000,
    limit: 3,
  },
  {
    name: 'medium',
    ttl: 10000,
    limit: 10,
  },
  {
    name: 'long',
    ttl: 60000,
    limit: 15,
  },
  {
    name: 'longer',
    ttl: 300000,
    limit: 20,
  },
]);
