import { useEffect, useRef } from "react";
import ConfettiBurst from "./ConfettiBurst";

type CompletionModalProps = {
  open: boolean;
  confettiActive: boolean;
  onAnotherTopic: () => void;
  onAnotherCategory: () => void;
};

export default function CompletionModal({
  open,
  confettiActive,
  onAnotherTopic,
  onAnotherCategory
}: CompletionModalProps) {
  const primaryButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    primaryButtonRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-shell">
        <ConfettiBurst active={confettiActive} />
        <div className="modal" role="dialog" aria-modal="true">
          <h2 className="modal-title">Puzzle complete!</h2>
          <p className="modal-text">Want another topic or a new category?</p>
          <div className="modal-actions">
            <button
              ref={primaryButtonRef}
              className="chip-action"
              type="button"
              onClick={onAnotherTopic}
            >
              Another topic
            </button>
            <button
              className="chip-action"
              type="button"
              onClick={onAnotherCategory}
            >
              Another category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
