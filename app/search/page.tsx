import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";

type SearchPageProps = {
  searchParams: Promise<{
    query?: string;
    community?: string;
    mode?: string;
  }>;
};

const representativeResults = [
  {
    category: "Masonry",
    title: "Masonry contractor",
    location: "Aberdeen & surrounding Harford County",
    precision: "Service area",
    summary: "Representative result-card state for a local masonry service.",
    slug: "service-area-preview",
  },
  {
    category: "Water & Well",
    title: "Well service provider",
    location: "Harford County",
    precision: "Service area",
    summary: "Representative result-card state for well and water service.",
    slug: "service-area-preview",
  },
  {
    category: "Tree Service",
    title: "Tree service provider",
    location: "Havre de Grace & nearby communities",
    precision: "Service area",
    summary: "Representative result-card state for local tree service.",
    slug: "service-area-preview",
  },
];

const communities: Record<string, string> = {
  harford: "Harford County",
  aberdeen: "Aberdeen",
  "havre-de-grace": "Havre de Grace",
  "bel-air": "Bel Air",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.query?.trim() || "";
  const community = communities[params.community || "harford"] || "Harford County";
  const emptyPreview = params.mode === "empty";

  return (
    <main id="main-content">
      <SiteHeader />

      <section className="results-hero">
        <div className="shell">
          <p className="breadcrumb">Maryland / Harford County / Search</p>
          <div className="results-hero-row">
            <div>
              <p className="eyebrow">Find services</p>
              <h1 className="results-title">
                {query ? <>Results for “{query}”</> : "Find local services"}
              </h1>
              <p>
                Showing the approved search/results experience for {community}.
              </p>
            </div>
            <span className="preview-badge">Representative UI state</span>
          </div>

          <form className="search-panel results-search" action="/search" method="get" role="search">
            <label>
              <span>What do you need help with?</span>
              <input
                name="query"
                defaultValue={query}
                placeholder="Try “masonry”, “well service”, or “roofing”"
              />
            </label>
            <label>
              <span>Community</span>
              <select name="community" defaultValue={params.community || "harford"}>
                <option value="harford">Harford County</option>
                <option value="aberdeen">Aberdeen</option>
                <option value="havre-de-grace">Havre de Grace</option>
                <option value="bel-air">Bel Air</option>
              </select>
            </label>
            <button className="button button-gold search-button" type="submit">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="results-section shell">
        <div className="results-toolbar">
          <div>
            <p className="eyebrow">Home Services</p>
            <h2>{emptyPreview ? "No matching results yet." : "Useful local options, without the clutter."}</h2>
          </div>
          <button className="button button-secondary map-toggle" type="button" aria-label="Map preview unavailable">
            Map
          </button>
        </div>

        <div className="results-layout">
          <aside className="filter-panel" aria-label="Search filters">
            <h3>Refine</h3>
            <label>
              <span>Category</span>
              <select defaultValue="">
                <option value="">All Home Services</option>
                <option>Masonry</option>
                <option>Landscaping</option>
                <option>Plumbing</option>
                <option>Roofing</option>
                <option>Water & Well</option>
              </select>
            </label>
            <label>
              <span>Community</span>
              <select defaultValue={params.community || "harford"}>
                <option value="harford">Harford County</option>
                <option value="aberdeen">Aberdeen</option>
                <option value="havre-de-grace">Havre de Grace</option>
                <option value="bel-air">Bel Air</option>
              </select>
            </label>
            <p className="filter-note">
              Distance stays hidden until the canonical implementation supports it truthfully.
            </p>
          </aside>

          <div className="results-list">
            {emptyPreview ? (
              <article className="zero-state">
                <p className="eyebrow">Try a broader search</p>
                <h3>Nothing matched this preview state.</h3>
                <p>
                  Broaden to Harford County, choose another service, or suggest a listing that should be included.
                </p>
                <div className="zero-actions">
                  <a className="button button-gold" href="/search?community=harford">
                    Search Harford County
                  </a>
                  <a className="button button-secondary" href="/#business">
                    Suggest a listing
                  </a>
                </div>
              </article>
            ) : (
              representativeResults.map((result) => (
                <article className="result-card" key={result.title}>
                  <div className="result-image" aria-hidden="true">
                    <span>Image area</span>
                  </div>
                  <div className="result-body">
                    <div className="result-meta-row">
                      <span className="result-category">{result.category}</span>
                      <span className="precision-badge">{result.precision}</span>
                    </div>
                    <h3>{result.title}</h3>
                    <p className="result-location">{result.location}</p>
                    <p>{result.summary}</p>
                    <p className="representative-note">Not live directory data.</p>
                    <div className="result-actions">
                      <a className="button button-gold" href={`/listing/${result.slug}`}>View details</a>
                      <span className="button button-secondary button-static">Website</span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <aside className="map-panel" aria-label="Map presentation boundary">
            <div className="map-grid" aria-hidden="true">
              <span className="map-pin pin-a" />
              <span className="map-pin pin-b" />
              <span className="map-pin pin-c" />
            </div>
            <div className="map-copy">
              <p className="eyebrow">Map boundary</p>
              <h3>Truthful location before fancy pins.</h3>
              <p>
                The final map connects only after exact-location and service-area semantics are verified against canonical data.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="results-trust">
        <div className="shell results-trust-row">
          <p>
            Preview content is intentionally generic. Live business names, ratings, locations, hours, and availability will come only from verified directory data.
          </p>
          <a className="text-link" href="/search?mode=empty&community=aberdeen">
            Preview zero-results state →
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
