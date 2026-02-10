type FactsSectionProps = {
  facts: string[];
};

export default function FactsSection({ facts }: FactsSectionProps) {
  return (
    <section className="facts">
      <h2 className="section-title">3 amazing facts</h2>
      {facts.length ? (
        <ul>
          {facts.map((fact, index) => (
            <li key={`${fact}-${index}`}>{fact}</li>
          ))}
        </ul>
      ) : (
        <p className="empty-muted">Facts appear once a topic is selected.</p>
      )}
    </section>
  );
}
