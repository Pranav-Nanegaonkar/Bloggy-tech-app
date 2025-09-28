export const calculateReadingTime = (content) => {
  const wordsPerMin = 200;

  // split by spaces, filter out empty strings
  const totalWords = content?.trim().split(/\s+/).length || 0;

  const minutes = totalWords / wordsPerMin;
  const readTime = Math.ceil(minutes);

  return readTime;
};
