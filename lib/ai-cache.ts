// Simple AI Response Cache
// Saves 50-80% on API costs by caching responses

interface CacheEntry {
  response: string;
  timestamp: number;
  model: string;
}

class AICache {
  private cache: Map<string, CacheEntry>;
  private maxAge: number; // milliseconds
  private maxSize: number;

  constructor(maxAge = 24 * 60 * 60 * 1000, maxSize = 10000) {
    this.cache = new Map();
    this.maxAge = maxAge; // Default: 24 hours
    this.maxSize = maxSize; // Default: 10k entries
  }

  // Generate cache key from message + model
  private generateKey(messages: string, model: string): string {
    // Simple hash - in production use proper hashing
    return `${model}:${messages}`;
  }

  // Get cached response
  get(messages: string, model: string): string | null {
    const key = this.generateKey(messages, model);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if expired
    const age = Date.now() - entry.timestamp;
    if (age > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    console.log('✅ Cache HIT - Saved API call!');
    return entry.response;
  }

  // Save response to cache
  set(messages: string, model: string, response: string): void {
    // Prevent cache from growing too large
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    const key = this.generateKey(messages, model);
    this.cache.set(key, {
      response,
      timestamp: Date.now(),
      model,
    });

    console.log('💾 Cached response for future use');
  }

  // Clear cache
  clear(): void {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }

  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      maxAge: this.maxAge / 1000 / 60, // minutes
    };
  }
}

// Export singleton instance
export const aiCache = new AICache(
  24 * 60 * 60 * 1000, // 24 hours
  10000 // 10k entries
);

// Export class for testing
export { AICache };
