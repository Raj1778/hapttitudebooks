"use server";

// Basic input sanitization to defend against MongoDB query selector injection
export async function sanitizeObject(obj) {
  if (obj == null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("$") || key.includes(".")) continue;
    clean[key] = sanitizeObject(value);
  }
  return clean;
}

export async function validateString(value, { min = 1, max = 200, pattern } = {}) {
  if (typeof value !== "string") return false;
  if (value.length < min || value.length > max) return false;
  if (pattern && !pattern.test(value)) return false;
  return true;
}

const defaultOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

export async function isAllowedOrigin(origin) {
  if (!origin) return true; // same-origin requests may not send Origin
  const allowed = process.env.NEXT_PUBLIC_SITE_URL
    ? [process.env.NEXT_PUBLIC_SITE_URL, ...defaultOrigins]
    : defaultOrigins;
  try {
    const o = new URL(origin);
    return allowed.includes(o.origin);
  } catch {
    return false;
  }
}


