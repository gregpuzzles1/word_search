type LoadingStateProps = {
  message?: string;
};

export default function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="status-card" role="status" aria-live="polite">
      <span className="status-title">Generating puzzle</span>
      <span className="status-message">
        {message ?? "Hang tight while we place the words."}
      </span>
    </div>
  );
}
