// https://env.t3.gg/docs/nextjs#create-your-schema
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const serverEnv = createEnv({
  server: {
    // Essential AI Keys (Required for core functionality)
    OPENAI_API_KEY: z.string().min(1),
    ANTHROPIC_API_KEY: z.string().min(1),
    
    // Core Infrastructure (Required)
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    
    // Optional AI Providers (can be added later)
    XAI_API_KEY: z.string().optional(),
    GROQ_API_KEY: z.string().optional(),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
    DAYTONA_API_KEY: z.string().optional(),
    
    // Optional Auth Providers (can be added later)
    GITHUB_CLIENT_ID: z.string().optional().default(""),
    GITHUB_CLIENT_SECRET: z.string().optional().default(""),
    GOOGLE_CLIENT_ID: z.string().optional().default(""),
    GOOGLE_CLIENT_SECRET: z.string().optional().default(""),
    TWITTER_CLIENT_ID: z.string().optional().default(""),
    TWITTER_CLIENT_SECRET: z.string().optional().default(""),
    
    // Optional Redis (can be added later)
    REDIS_URL: z.string().optional(),
    UPSTASH_REDIS_REST_URL: z.string().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
    
    // Optional Service APIs (can be added later)
    ELEVENLABS_API_KEY: z.string().optional(),
    TAVILY_API_KEY: z.string().optional(),
    EXA_API_KEY: z.string().optional(),
    VALYU_API_KEY: z.string().optional(),
    TMDB_API_KEY: z.string().optional(),
    YT_ENDPOINT: z.string().optional(),
    FIRECRAWL_API_KEY: z.string().optional(),
    PARALLEL_API_KEY: z.string().optional(),
    OPENWEATHER_API_KEY: z.string().optional(),
    GOOGLE_MAPS_API_KEY: z.string().optional(),
    AMADEUS_API_KEY: z.string().optional(),
    AMADEUS_API_SECRET: z.string().optional(),
    CRON_SECRET: z.string().optional(),
    BLOB_READ_WRITE_TOKEN: z.string().optional(),
    SMITHERY_API_KEY: z.string().optional(),
    COINGECKO_API_KEY: z.string().optional(),
    QSTASH_TOKEN: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    SUPERMEMORY_API_KEY: z.string().optional(),
    ALLOWED_ORIGINS: z.string().optional().default('http://localhost:3000'),
  },
  experimental__runtimeEnv: process.env,
});
