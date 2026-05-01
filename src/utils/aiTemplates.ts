// src/utils/aiTemplates.ts
// Strict AI prompt templates with controlled token usage

export const AI_TEMPLATES = {
  explainSimply: (topic: string): string =>
    `Explain ${topic} in simple terms in under 100 words with one example.`,

  giveHint: (problem: string): string =>
    `Give a hint for solving this problem without giving the answer: ${problem}`,

  explainCode: (code: string, language: string): string =>
    `Explain this ${language} code in simple terms in under 100 words: ${code}`,
} as const;

export const AI_CONFIG = {
  maxTokens: 150,
  temperature: 0.7,
  model: "gpt-3.5-turbo",
} as const;
