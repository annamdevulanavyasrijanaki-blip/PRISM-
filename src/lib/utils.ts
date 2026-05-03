import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates a fluid font size based on character count to prevent overflow in fixed-width containers (like A4).
 * @param text The text to measure
 * @param baseRem The default font size in rem
 * @param minRem The minimum allowed font size in rem
 * @param threshold The character count after which scaling begins
 */
export function getDynamicFontSize(text: string, baseRem: number = 2.25, minRem: number = 1.1, threshold: number = 20, multiplier: number = 1) {
  if (!text) return `${baseRem * multiplier}rem`;
  const length = text.length;
  const words = text.split(/\s+/);
  const maxWordLength = Math.max(...words.map(w => w.length));
  
  let calculatedSize = baseRem;
  
  // Choose the more restrictive factor: total length or individual word length
  // Word threshold is typically around 8-10 characters for a sidebar
  const wordThreshold = 10;
  
  if (length > threshold || maxWordLength > wordThreshold) {
    const totalScale = length > threshold ? (length - threshold) * 0.04 : 0;
    const wordScale = maxWordLength > wordThreshold ? (maxWordLength - wordThreshold) * 0.12 : 0;
    
    calculatedSize = baseRem - Math.max(totalScale, wordScale);
  }
  
  return `${Math.max(calculatedSize, minRem) * multiplier}rem`;
}
