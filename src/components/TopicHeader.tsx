type TopicHeaderProps = {
  label: string | null;
  onShuffle: () => void;
  disabled: boolean;
};

export default function TopicHeader({
  label,
  onShuffle,
  disabled
}: TopicHeaderProps) {
  return (
    <section className="topic-panel">
      <div className="chip-panel-header">
        <h2 className="section-title">Topic: {label ?? "Select a category"}</h2>
        <button
          className="chip-action"
          type="button"
          onClick={onShuffle}
          disabled={disabled}
        >
          Shuffle Topic
        </button>
      </div>
    </section>
  );
}
