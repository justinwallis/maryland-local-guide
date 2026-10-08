import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="state-page">
        <div className="shell state-shell">
          <p className="eyebrow">Page not found</p>
          <h1>This local path doesn’t exist.</h1>
          <p>
            Try the Harford County hub, search local services, or return to the Maryland Local Guide home page.
          </p>
          <div className="state-actions">
            <a className="button button-gold" href="/maryland/harford-county">
              Explore Harford County
            </a>
            <a className="button button-secondary" href="/search?community=harford">
              Search services
            </a>
            <a className="text-link" href="/">Back home →</a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
