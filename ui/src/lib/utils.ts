export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    return "Less than a minute";
  }
  if (minutes === 1) {
    return "1 minute";
  }
  return `${minutes} minutes`;
}
