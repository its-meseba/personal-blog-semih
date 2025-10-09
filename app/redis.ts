import { Redis } from "@upstash/redis";

// Create a mock Redis implementation that safely returns empty data
const createMockRedis = () => {
  console.log("Using mock Redis implementation");
  return {
    hgetall: async () => ({}),
    hget: async () => null,
    hincrby: async () => 0,
    set: async () => null,
    get: async () => null,
  };
};

// Use mock Redis when env var explicitly tells us to skip Redis during build
// This prevents network calls during static generation on Vercel
const shouldSkipRedis = process.env.SKIP_REDIS_DURING_BUILD === 'true';

const hasRedisConfig = 
  process.env.UPSTASH_REDIS_REST_TOKEN && 
  process.env.UPSTASH_REDIS_REST_URL;

const redis = !hasRedisConfig || shouldSkipRedis
  ? createMockRedis()
  : new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

export default redis;
