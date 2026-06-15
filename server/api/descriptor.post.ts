import { descriptors } from '../utils/descriptors'
import { useRedis } from '../utils/redis'

// 1 week, in seconds.
const TTL_SECONDS = 60 * 60 * 24 * 7

// Keys:
//   descriptor:email:<emailHash>  -> index of the descriptor claimed by this email (dedup)
//   descriptor:claimed:<index>    -> emailHash that owns the descriptor at <index> (no duplicates)
const emailKey = (hash: string) => `descriptor:email:${hash}`
const claimedKey = (index: number) => `descriptor:claimed:${index}`

export default defineEventHandler(async (event) => {
  const body = await readBody<{ emailHash?: unknown }>(event)
  const emailHash = body?.emailHash

  if (typeof emailHash !== 'string' || !/^[0-9a-f]{64}$/.test(emailHash)) {
    throw createError({ statusCode: 400, statusMessage: 'A valid SHA-256 hex hash is required.' })
  }

  const redis = useRedis()

  // If this email already claimed a descriptor, always hand back the same one.
  const existing = await redis.get<number>(emailKey(emailHash))
  if (existing !== null && existing !== undefined && descriptors[existing]) {
    return { descriptor: descriptors[existing] }
  }

  // Derive a deterministic starting index from the hash, then linear-probe
  // forward, atomically claiming the first descriptor that is still free.
  const total = descriptors.length
  const start = Number(BigInt(`0x${emailHash}`) % BigInt(total))

  for (let offset = 0; offset < total; offset++) {
    const index = (start + offset) % total
    // NX => only set if unclaimed; the winner of the race gets "OK", everyone else null.
    const claimed = await redis.set(claimedKey(index), emailHash, { nx: true, ex: TTL_SECONDS })
    if (claimed === 'OK') {
      await redis.set(emailKey(emailHash), index, { ex: TTL_SECONDS })
      return { descriptor: descriptors[index] }
    }
  }

  // Every descriptor is currently claimed.
  throw createError({
    statusCode: 409,
    statusMessage: 'No descriptors are available right now. Please try again later.',
  })
})
