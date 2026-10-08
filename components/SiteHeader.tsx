import { BrandLogo } from "./BrandLogo";

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <div className="shell nav-shell">
          <a className="brand" href="/" aria-label="Maryland Local Guide home">
            <BrandLogo compactOnMobile />
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="/search?community=harford">Find Services</a>
            <a href="/maryland/harford-county#local-guides">Browse Places</a>
            <a href="/maryland/harford-county">Explore Maryland</a>
            <a href="/guides/planning-a-home-project">Resources</a>
          </nav>

          <a className="button button-gold nav-cta" href="/#business">
            For Businesses
          </a>

          <details className="mobile-menu">
            <summary aria-label="Open navigation">Menu</summary>
            <nav aria-label="Mobile navigation">
              <a href="/search?community=harford">Find Services</a>
              <a href="/maryland/harford-county#local-guides">Browse Places</a>
              <a href="/maryland/harford-county">Explore Maryland</a>
              <a href="/guides/planning-a-home-project">Resources</a>
              <a href="/#business">For Businesses</a>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
