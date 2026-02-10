import { sampleUnique } from "./random";
import { wordMixForViewport } from "./viewport";
import type { ViewportClass } from "./viewport";

const normalizeWords = (words: string[]) =>
  Array.from(new Set(words.map((word) => word.trim()).filter(Boolean)));

const takeUnique = (source: string[], count: number, used: Set<string>) => {
  const available = source.filter((word) => !used.has(word));
  const picked = sampleUnique(available, count);
  picked.forEach((word) => used.add(word));
  return picked;
};

export const selectWordsForViewport = (params: {
  easy: string[];
  medium: string[];
  hard: string[];
  viewport: ViewportClass;
}): string[] => {
  const mix = wordMixForViewport(params.viewport);
  const easy = normalizeWords(params.easy);
  const medium = normalizeWords(params.medium);
  const hard = normalizeWords(params.hard);

  const used = new Set<string>();
  const selected: string[] = [];
  const targetTotal = mix.easy + mix.medium + mix.hard;

  selected.push(...takeUnique(easy, mix.easy, used));
  selected.push(...takeUnique(medium, mix.medium, used));
  if (mix.hard > 0) {
    selected.push(...takeUnique(hard, mix.hard, used));
  }

  const fillRemaining = (source: string[]) => {
    const remaining = targetTotal - selected.length;
    if (remaining <= 0) return;
    selected.push(...takeUnique(source, remaining, used));
  };

  fillRemaining(easy);
  fillRemaining(medium);
  if (mix.hard > 0) {
    fillRemaining(hard);
  }

  return selected;
};
