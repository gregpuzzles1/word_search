export type Category = {
  slug: string;
  label: string;
  path: string;
};

export type CategoriesIndex = {
  categories: Category[];
  count?: number;
  generated_at?: string;
  base_path?: string;
};

export type TopicList = {
  category: string;
  topics: string[];
};

export type LabelTopic = {
  slug: string;
  label: string;
};

export type LabelTopicsIndex = {
  category: string;
  topics: LabelTopic[];
  count?: number;
  generated_at?: string;
  sources_hint?: string;
};

export type TopicWords = {
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  words: string[];
  count?: number;
};

export type TopicFacts = {
  category: string;
  topic: string;
  facts: string[];
  count?: number;
  sources_hint?: string;
  generated_at?: string;
};
