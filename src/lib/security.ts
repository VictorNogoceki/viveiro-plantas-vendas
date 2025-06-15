
// Content Security Policy helpers
export const generateCSPNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Rate limiting utility (for future API calls)
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  isAllowed(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const keyRequests = this.requests.get(key)!;
    
    // Remove old requests outside the window
    const validRequests = keyRequests.filter(timestamp => timestamp > windowStart);
    this.requests.set(key, validRequests);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

// Secure local storage wrapper
export const secureStorage = {
  setItem: (key: string, value: any): void => {
    try {
      const sanitizedKey = sanitizeStorageKey(key);
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(sanitizedKey, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  getItem: (key: string): any => {
    try {
      const sanitizedKey = sanitizeStorageKey(key);
      const item = localStorage.getItem(sanitizedKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    try {
      const sanitizedKey = sanitizeStorageKey(key);
      localStorage.removeItem(sanitizedKey);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

const sanitizeStorageKey = (key: string): string => {
  return key.replace(/[^a-zA-Z0-9_-]/g, '_');
};

// Error boundary utility
export const logSecurityEvent = (event: string, details?: any): void => {
  console.warn(`Security Event: ${event}`, details);
  // In production, this would send to monitoring service
};

// Input length constants
export const INPUT_LIMITS = {
  PRODUCT_NAME: 100,
  PRODUCT_CODE: 20,
  PRODUCT_DESCRIPTION: 500,
  CLIENT_NAME: 100,
  CLIENT_EMAIL: 100,
  ADDRESS: 200,
  DESCRIPTION: 200
} as const;
