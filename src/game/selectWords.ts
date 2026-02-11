import { shuffle } from "./random";
import { wordMixForViewport } from "./viewport";
import type { ViewportClass } from "./viewport";

const normalizeWords = (words: string[]) =>
  Array.from(new Set(words.map((word) => word.trim()).filter(Boolean)));

const normalizeKey = (word: string) => word.toLowerCase().replace(/[^a-z0-9]/g, "");

const isSimilar = (candidate: string, selectedKeys: string[]) => {
  const key = normalizeKey(candidate);
  if (!key) return false;
  return selectedKeys.some((selected) =>
    selected === key || selected.includes(key) || key.includes(selected)
  );
};

const takeUnique = (
  source: string[],
  count: number,
  used: Set<string>,
  selectedKeys: string[]
) => {
  const available = source.filter((word) => !used.has(word));
  const shuffled = shuffle(available);
  const picked: string[] = [];

  for (const word of shuffled) {
    if (picked.length >= count) break;
    if (isSimilar(word, selectedKeys)) continue;
    used.add(word);
    selectedKeys.push(normalizeKey(word));
    picked.push(word);
  }

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
  const selectedKeys: string[] = [];
  const selected: string[] = [];
  const targetTotal = mix.easy + mix.medium + mix.hard;

  selected.push(...takeUnique(easy, mix.easy, used, selectedKeys));
  selected.push(...takeUnique(medium, mix.medium, used, selectedKeys));
  if (mix.hard > 0) {
    selected.push(...takeUnique(hard, mix.hard, used, selectedKeys));
  }

  const fillRemaining = (source: string[]) => {
    const remaining = targetTotal - selected.length;
    if (remaining <= 0) return;
    selected.push(...takeUnique(source, remaining, used, selectedKeys));
  };

  fillRemaining(easy);
  fillRemaining(medium);
  if (mix.hard > 0) {
    fillRemaining(hard);
  }

  return selected;
};
