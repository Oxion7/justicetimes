const WORDS_PER_MINUTE = 80;
export const calculateReadTime = (content: string): number => {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / WORDS_PER_MINUTE);
};