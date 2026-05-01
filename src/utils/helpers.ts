// src/utils/helpers.ts
// General utility helpers

/**
 * Delays execution for given milliseconds
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generates a slug from a string
 */
export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

/**
 * De-slugifies a slug back to readable text
 */
export const deslugify = (slug: string): string =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/**
 * Clamps a number between min and max
 */
export const clamp = (num: number, min: number, max: number): number =>
  Math.min(Math.max(num, min), max);

/**
 * Generates a random array of integers
 */
export const generateRandomArray = (
  size: number,
  min: number = 1,
  max: number = 100
): number[] =>
  Array.from({ length: size }, () =>
    Math.floor(Math.random() * (max - min + 1) + min)
  );

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
