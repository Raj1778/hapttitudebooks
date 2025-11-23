// Basic input sanitization to defend against MongoDB query selector injection
export async function sanitizeObject(obj) {
  // Handle null/undefined
  if (obj == null) return obj;
  
  // Return primitives (string, number, boolean, etc.) as-is
  if (typeof obj !== "object") return obj;
  
  // Handle arrays
  if (Array.isArray(obj)) {
    const results = await Promise.all(obj.map(sanitizeObject));
    return results;
  }
  
  // Handle Date objects and other special objects
  if (obj instanceof Date || obj instanceof RegExp) return obj;
  
  // Handle plain objects
  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip keys that could be used for MongoDB injection
    if (key.startsWith("$") || key.includes(".")) {
      continue;
    }
    
    // Recursively sanitize nested objects/arrays, but return primitives as-is
    if (value != null && typeof value === "object" && !(value instanceof Date) && !(value instanceof RegExp)) {
      if (Array.isArray(value)) {
        clean[key] = await Promise.all(value.map(sanitizeObject));
      } else {
        clean[key] = await sanitizeObject(value);
      }
    } else {
      // Return primitives directly (string, number, boolean, null, Date, RegExp)
      clean[key] = value;
    }
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
  // Same-origin requests may not send Origin header - allow them
  if (!origin) return true;
  
  // Get allowed origins
  const allowed = [];
  
  // Add NEXT_PUBLIC_SITE_URL if set
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    allowed.push(process.env.NEXT_PUBLIC_SITE_URL);
  }
  
  // Add Vercel deployment URL if available
  if (process.env.VERCEL_URL) {
    allowed.push(`https://${process.env.VERCEL_URL}`);
  }
  
  // Add default localhost origins
  allowed.push(...defaultOrigins);
  
  try {
    const o = new URL(origin);
    const originUrl = o.origin;
    
    // Check exact match
    if (allowed.includes(originUrl)) {
      return true;
    }
    
    // Also allow if it's a Vercel preview/deployment URL
    if (originUrl.includes('.vercel.app')) {
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
}


