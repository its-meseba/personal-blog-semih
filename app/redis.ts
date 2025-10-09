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

// Create a Redis client with timeout wrapper to prevent hanging builds
const createRedisWithTimeout = (url: string, token: string) => {
  const client = new Redis({ url, token });
  
  // Wrap each method with a timeout
  const withTimeout = async (promise: Promise<any>, timeoutMs = 5000) => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Redis operation timed out')), timeoutMs);
    });
    return Promise.race([promise, timeoutPromise]);
  };

  return {
    hgetall: async (key: string) => withTimeout(client.hgetall(key)),
    hget: async (key: string, field: string) => withTimeout(client.hget(key, field)),
    hincrby: async (key: string, field: string, value: number) => withTimeout(client.hincrby(key, field, value)),
    set: async (key: string, value: any) => withTimeout(client.set(key, value)),
    get: async (key: string) => withTimeout(client.get(key)),
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
  : createRedisWithTimeout(
      process.env.UPSTASH_REDIS_REST_URL!,
      process.env.UPSTASH_REDIS_REST_TOKEN!
    );

export default redis;
