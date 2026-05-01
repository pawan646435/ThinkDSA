// src/hooks/useAI.ts
// Hook for controlled AI interactions with caching

import { useState, useCallback } from "react";
import { generateHashKey, normalizePrompt } from "@/utils/hash";
import { AI_TEMPLATES } from "@/utils/aiTemplates";

interface AIResponse {
  text: string;
  cached: boolean;
}

/**
 * Custom hook for AI-powered explanations with caching.
 * NEVER calls AI automatically — only on explicit user action.
 */
export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches AI explanation with cache-first strategy.
   * Flow: Normalize → Hash → Check cache → API (if miss) → Store → Return
   */
  const fetchAIResponse = useCallback(
    async (prompt: string): Promise<AIResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const normalized = normalizePrompt(prompt);
        const cacheKey = generateHashKey(normalized);

        const response = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: normalized, cacheKey }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch AI response");
        }

        const data = await response.json();
        return { text: data.text, cached: data.cached };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /** Explain a topic simply — triggered only by user click */
  const explainSimply = useCallback(
    (topic: string) => fetchAIResponse(AI_TEMPLATES.explainSimply(topic)),
    [fetchAIResponse]
  );

  /** Give a hint — triggered only by user click */
  const giveHint = useCallback(
    (problem: string) => fetchAIResponse(AI_TEMPLATES.giveHint(problem)),
    [fetchAIResponse]
  );

  /** Explain code — triggered only by user click */
  const explainCode = useCallback(
    (code: string, language: string) =>
      fetchAIResponse(AI_TEMPLATES.explainCode(code, language)),
    [fetchAIResponse]
  );

  return {
    loading,
    error,
    explainSimply,
    giveHint,
    explainCode,
  };
}
