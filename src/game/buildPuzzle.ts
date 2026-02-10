import { loadLabelTopics, loadTopicFacts, loadTopicSlugs, loadTopicWords } from "../data/wordcache";
import { generateGrid } from "./generator";
import { pickOne } from "./random";
import { selectWordsForViewport } from "./selectWords";
import { gridSizeForViewport } from "./viewport";
import type { ViewportClass } from "./viewport";
import type { Category } from "../data/types";
import type { Puzzle } from "./state";

export const buildPuzzle = async (params: {
  category: Category;
  viewport: ViewportClass;
  topicSlug?: string;
}): Promise<Puzzle> => {
  const topics = await loadTopicSlugs(params.category.slug);
  const chosenTopic = params.topicSlug ?? pickOne(topics);
  if (!chosenTopic) {
    throw new Error("No topics available for selected category.");
  }

  const labelTopics = await loadLabelTopics(params.category.slug);
  const topicLabel =
    labelTopics.topics.find((topic) => topic.slug === chosenTopic)?.label ??
    chosenTopic;

  const [easy, medium, hard] = await Promise.all([
    loadTopicWords(params.category.slug, chosenTopic, "easy"),
    loadTopicWords(params.category.slug, chosenTopic, "medium"),
    loadTopicWords(params.category.slug, chosenTopic, "hard").catch(() => null)
  ]);

  const selectedWords = selectWordsForViewport({
    easy: easy.words,
    medium: medium.words,
    hard: hard?.words ?? [],
    viewport: params.viewport
  });

  const gridSize = gridSizeForViewport(params.viewport);
  const generated = generateGrid(selectedWords, gridSize);

  const factsFile = await loadTopicFacts(params.category.slug, chosenTopic).catch(
    () => null
  );
  const facts = factsFile?.facts ?? [];
  const factsShown = facts.sort(() => Math.random() - 0.5).slice(0, 3);

  const puzzleId = `${params.category.slug}-${chosenTopic}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  return {
    puzzleId,
    category: params.category,
    topicSlug: chosenTopic,
    topicLabel,
    gridRows: gridSize.rows,
    gridCols: gridSize.cols,
    words: selectedWords,
    grid: generated.grid,
    placements: generated.placements,
    foundWords: [],
    facts: factsShown
  };
};
