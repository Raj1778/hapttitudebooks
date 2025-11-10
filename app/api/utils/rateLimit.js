"use server";

// Simple in-memory rate limiter keyed by IP + route
// Allows N requests per windowMs
const buckets = new Map();

function getKey(ip, route) {
  return `${route}:${ip}`;
}

export async function rateLimit({ windowMs = 60_000, max = 60 } = {}) {
  const now = Date.now();
  // Cleanup occasionally
  for (const [key, bucket] of buckets) {
    if (bucket.reset <= now) buckets.delete(key);
  }
  return async function check(route, ip) {
    const key = getKey(ip || "unknown", route);
    const existing = buckets.get(key);
    if (!existing || existing.reset <= now) {
      buckets.set(key, { count: 1, reset: now + windowMs });
      return { ok: true };
    }
    if (existing.count >= max) {
      return { ok: false, retryAfterMs: existing.reset - now };
    }
    existing.count += 1;
    return { ok: true };
  };
}


