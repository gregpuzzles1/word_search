type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
  onReset?: () => void;
};

export default function ErrorState({
  message,
  onRetry,
  onReset
}: ErrorStateProps) {
  return (
    <div className="status-card" role="alert">
      <span className="status-title">Something went wrong</span>
      <span className="status-message">{message}</span>
      <div className="status-actions">
        {onRetry ? (
          <button className="chip-action" type="button" onClick={onRetry}>
            Try again
          </button>
        ) : null}
        {onReset ? (
          <button className="chip-action" type="button" onClick={onReset}>
            Choose another category
          </button>
        ) : null}
      </div>
    </div>
  );
}
