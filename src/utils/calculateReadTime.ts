export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 80;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};
