export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
      <div className="shell nav-shell">
        <a className="brand" href="/" aria-label="Maryland Local Guide home">
          <span className="brand-mark" aria-hidden="true">MD</span>
          <span>
            <strong>Maryland</strong>
            <em>Local Guide</em>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="/#services">Find Services</a>
          <a href="/#places">Browse Places</a>
          <a href="/#communities">Explore Maryland</a>
          <a href="/#resources">Resources</a>
        </nav>

        <a className="button button-gold nav-cta" href="/#business">
          Add Your Business
        </a>

        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            <a href="/#services">Find Services</a>
            <a href="/#places">Browse Places</a>
            <a href="/#communities">Explore Maryland</a>
            <a href="/#resources">Resources</a>
            <a href="/#business">Add Your Business</a>
          </nav>
        </details>
      </div>
      </header>
    </>
  );
}
