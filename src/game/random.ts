export const shuffle = <T>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const sampleUnique = <T>(items: T[], count: number): T[] => {
  if (count <= 0) return [];
  const shuffled = shuffle(items);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const pickOne = <T>(items: T[]): T | undefined => {
  if (!items.length) return undefined;
  return items[Math.floor(Math.random() * items.length)];
};
