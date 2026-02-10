import { fetchJson } from "./fetchJson";
import type {
  CategoriesIndex,
  Category,
  LabelTopicsIndex,
  TopicFacts,
  TopicList,
  TopicWords
} from "./types";

const WORDCACHE_BASE = "/wordcache";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const validateCategories = (data: unknown): string[] => {
  if (!isRecord(data)) return ["root is not an object"];
  if (!Array.isArray(data.categories)) return ["categories is not an array"];
  const invalid = data.categories.filter(
    (entry) =>
      !isRecord(entry) ||
      typeof entry.slug !== "string" ||
      typeof entry.label !== "string" ||
      typeof entry.path !== "string"
  );
  return invalid.length ? ["categories entries are invalid"] : [];
};

const validateTopics = (data: unknown): string[] => {
  if (!isRecord(data)) return ["root is not an object"];
  if (typeof data.category !== "string") return ["category is missing"];
  if (!isStringArray(data.topics)) return ["topics is not a string array"];
  return [];
};

const validateLabelTopics = (data: unknown): string[] => {
  if (!isRecord(data)) return ["root is not an object"];
  if (typeof data.category !== "string") return ["category is missing"];
  if (!Array.isArray(data.topics)) return ["topics is not an array"];
  const invalid = data.topics.filter(
    (entry) =>
      !isRecord(entry) ||
      typeof entry.slug !== "string" ||
      typeof entry.label !== "string"
  );
  return invalid.length ? ["topics entries are invalid"] : [];
};

const validateTopicWords = (data: unknown): string[] => {
  if (!isRecord(data)) return ["root is not an object"];
  if (typeof data.topic !== "string") return ["topic is missing"];
  if (typeof data.difficulty !== "string") return ["difficulty is missing"];
  if (!isStringArray(data.words)) return ["words is not a string array"];
  return [];
};

const validateTopicFacts = (data: unknown): string[] => {
  if (!isRecord(data)) return ["root is not an object"];
  if (typeof data.category !== "string") return ["category is missing"];
  if (typeof data.topic !== "string") return ["topic is missing"];
  if (!isStringArray(data.facts)) return ["facts is not a string array"];
  return [];
};

export async function loadCategories(): Promise<Category[]> {
  const url = `${WORDCACHE_BASE}/categories.json`;
  const data = await fetchJson<CategoriesIndex>(url, validateCategories);
  return data.categories;
}

export async function loadTopicSlugs(categorySlug: string): Promise<string[]> {
  const url = `${WORDCACHE_BASE}/${categorySlug}/topics.json`;
  const data = await fetchJson<TopicList>(url, validateTopics);
  return data.topics;
}

export async function loadLabelTopics(
  categorySlug: string
): Promise<LabelTopicsIndex> {
  const url = `${WORDCACHE_BASE}/${categorySlug}/label_topics.json`;
  return fetchJson<LabelTopicsIndex>(url, validateLabelTopics);
}

export async function loadTopicWords(
  categorySlug: string,
  topicSlug: string,
  difficulty: "easy" | "medium" | "hard"
): Promise<TopicWords> {
  const url = `${WORDCACHE_BASE}/${categorySlug}/${topicSlug}_${difficulty}.json`;
  return fetchJson<TopicWords>(url, validateTopicWords);
}

export async function loadTopicFacts(
  categorySlug: string,
  topicSlug: string
): Promise<TopicFacts> {
  const url = `${WORDCACHE_BASE}/${categorySlug}/${topicSlug}_facts.json`;
  return fetchJson<TopicFacts>(url, validateTopicFacts);
}

export function resolveTopicLabel(
  labelTopics: LabelTopicsIndex,
  topicSlug: string
): string {
  const match = labelTopics.topics.find((topic) => topic.slug === topicSlug);
  return match?.label ?? topicSlug;
}
