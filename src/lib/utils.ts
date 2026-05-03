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

export function hasData(sectionId: string, data: any): boolean {
  if (!data) return false;
  
  switch (sectionId) {
    case 'summary':
      return !!data.personal?.summary;
    case 'experience':
      return !!(data.experience?.length > 0 && data.experience.some((e: any) => e.position || e.company || e.description));
    case 'education':
      return !!(data.education?.length > 0 && data.education.some((e: any) => e.school || e.degree));
    case 'skills':
      return !!(data.skills?.length > 0 && data.skills.some((s: any) => s.name));
    case 'projects':
      return !!(data.projects?.length > 0 && data.projects.some((p: any) => p.name || p.description));
    case 'certifications':
      return !!(data.certifications?.length > 0 && data.certifications.some((c: any) => c.name));
    case 'awards':
      return !!(data.awards?.length > 0 && data.awards.some((a: any) => a.title));
    case 'languages':
      return !!(data.languages?.length > 0 && data.languages.some((l: any) => l.name));
    case 'volunteer':
      return !!(data.volunteer?.length > 0 && data.volunteer.some((v: any) => v.organization || v.role));
    case 'interests':
      return !!(data.interests?.length > 0 && data.interests.some((i: any) => i.name));
    case 'custom':
      return !!(data.customSections?.length > 0 && data.customSections.some((c: any) => c.title || c.content));
    default:
      return false;
  }
}
