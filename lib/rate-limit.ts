import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { serverEnv } from '@/env/server';

// Create Redis client only if credentials are available
const redis = serverEnv.UPSTASH_REDIS_REST_URL && serverEnv.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: serverEnv.UPSTASH_REDIS_REST_URL,
      token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Create a new ratelimiter that allows 3 requests per day for unauthenticated users
// If Redis is not available, rate limiting will be disabled
export const unauthenticatedRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '1 d'), // 3 requests per 1 day
      analytics: true,
      prefix: '@upstash/ratelimit:unauth',
    })
  : null;

// Helper function to get IP address from request
export function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] ?? realIp ?? 'unknown';
  return `ip:${ip}`;
}

