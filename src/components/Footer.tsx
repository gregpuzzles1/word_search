const START_YEAR = 2026;

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const yearRange =
    currentYear > START_YEAR ? `${START_YEAR}–${currentYear}` : `${START_YEAR}`;

  return (
    <footer className="footer">
      <div className="footer-links">
        <span>© {yearRange} Greg Christian</span>
        <span className="footer-sep">·</span>
        <span>MIT License</span>
        <span className="footer-sep">·</span>
        <a href="https://github.com/gregpuzzles1/word_search">GitHub Repo</a>
        <span className="footer-sep">·</span>
        <a href="https://github.com/gregpuzzles1/word_search/issues/new">
          Open Issue
        </a>
      </div>
    </footer>
  );
}
