import type { Category } from "../data/types";

type CategoryChipCloudProps = {
  categories: Category[];
  selectedSlug: string | null;
  onShuffle: () => void;
  onSelect: (category: Category) => void;
};

export default function CategoryChipCloud({
  categories,
  selectedSlug,
  onShuffle,
  onSelect
}: CategoryChipCloudProps) {
  return (
    <section className="chip-panel" id="category-chip-cloud" tabIndex={-1}>
      <div className="chip-panel-header">
        <h2 className="section-title">Categories</h2>
        <button className="chip-action" type="button" onClick={onShuffle}>
          Shuffle Categories
        </button>
      </div>
      <div className="chip-cloud" aria-label="Category chips">
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            className={`chip chip-button${
              selectedSlug === category.slug ? " chip-selected" : ""
            }`}
            aria-pressed={selectedSlug === category.slug}
            onClick={() => onSelect(category)}
          >
            {category.label}
          </button>
        ))}
      </div>
    </section>
  );
}
