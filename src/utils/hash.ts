// src/utils/hash.ts
// Utility for generating deterministic hash keys for AI cache

/**
 * Normalizes a prompt string for consistent caching.
 * Lowercases, trims, and removes extra whitespace.
 */
export function normalizePrompt(prompt: string): string {
  return prompt.toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Generates a simple hash string from a normalized prompt.
 * Uses a fast, non-cryptographic hash suitable for cache keys.
 */
export function generateHashKey(prompt: string): string {
  const normalized = normalizePrompt(prompt);
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `ai_cache_${Math.abs(hash).toString(36)}`;
}
