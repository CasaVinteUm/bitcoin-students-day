import { Redis } from '@upstash/redis'

// Reads UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from the environment.
let client: Redis | null = null

export function useRedis(): Redis {
  if (!client) {
    client = Redis.fromEnv()
  }
  return client
}
