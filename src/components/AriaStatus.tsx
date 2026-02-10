type AriaStatusProps = {
  message: string;
};

export default function AriaStatus({ message }: AriaStatusProps) {
  return (
    <div className="sr-only" role="status" aria-live="polite">
      {message}
    </div>
  );
}
