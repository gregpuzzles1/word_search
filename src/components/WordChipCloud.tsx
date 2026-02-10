type WordChipCloudProps = {
  words: string[];
  foundWords?: string[];
};

export default function WordChipCloud({
  words,
  foundWords = []
}: WordChipCloudProps) {
  const foundSet = new Set(foundWords);

  return (
    <div className="chip-cloud" aria-label="Topic word chips">
      {words.map((word) => (
        <span
          key={word}
          className={`chip chip-word${foundSet.has(word) ? " chip-found" : ""}`}
        >
          {word}
        </span>
      ))}
    </div>
  );
}
