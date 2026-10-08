import type { Metadata } from "next";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { getDirectoryReadAdapter } from "../../lib/directory/provider";

export const metadata: Metadata = {
  title: "Search Local Services",
  description: "Search local service categories and communities across Harford County, Maryland.",
};

type SearchPageProps = {
  searchParams: Promise<{
    query?: string;
    community?: string;
    mode?: string;
  }>;
};

const communities: Record<string, string> = {
  harford: "Harford County",
  aberdeen: "Aberdeen",
  "havre-de-grace": "Havre de Grace",
  "bel-air": "Bel Air",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.query?.trim() || "";
  const communityKey = params.community || "harford";
  const community = communities[communityKey] || "Harford County";
  const emptyPreview = params.mode === "empty";

  const directory = getDirectoryReadAdapter();
  const resultSet = await directory.searchListings({
    query,
    community: communityKey,
  });

  return (
    <>
      <SiteHeader />

      <main id="main-content">
        <section className="results-hero">
          <div className="shell">
            <p className="breadcrumb">Maryland / Harford County / Search</p>
            <div className="results-hero-row">
              <div>
                <p className="eyebrow">Find services</p>
                <h1 className="results-title">
                  {query ? <>Results for “{query}”</> : "Find local services"}
                </h1>
                <p>Browse local service options for {community}.</p>
              </div>
              <span className="preview-badge">Preview data</span>
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
                <select name="community" defaultValue={communityKey}>
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
              <h2>{emptyPreview ? "No matches in this preview." : "Useful local options, without the clutter."}</h2>
            </div>
            <button
              className="button button-secondary map-toggle"
              type="button"
              aria-label="Map view unavailable in preview"
              disabled
            >
              Map
            </button>
          </div>

          <div className="results-layout">
            <aside className="filter-panel" aria-label="Search filters">
              <h3>Refine</h3>
              <label>
                <span>Category</span>
                <select defaultValue="" disabled>
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
                <select defaultValue={communityKey} disabled>
                  <option value="harford">Harford County</option>
                  <option value="aberdeen">Aberdeen</option>
                  <option value="havre-de-grace">Havre de Grace</option>
                  <option value="bel-air">Bel Air</option>
                </select>
              </label>
              <p className="filter-note">
                Additional filters activate only after the live directory contract is connected and verified.
              </p>
            </aside>

            <div className="results-list">
              {emptyPreview ? (
                <article className="zero-state">
                  <p className="eyebrow">Try a broader search</p>
                  <h3>Nothing matched this preview.</h3>
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
                resultSet.items.map((result) => (
                  <article className="result-card" key={`${result.category}-${result.title}`}>
                    <div className="result-image" aria-hidden="true" />
                    <div className="result-body">
                      <div className="result-meta-row">
                        <span className="result-category">{result.category}</span>
                        <span className="precision-badge">{result.precisionLabel}</span>
                      </div>
                      <h3>{result.title}</h3>
                      <p className="result-location">{result.locationLabel}</p>
                      <p>{result.summary}</p>
                      <p className="representative-note">Preview listing — not live directory data.</p>
                      <div className="result-actions">
                        <a className="button button-gold" href={`/listing/${result.slug}`}>View details</a>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            <aside className="map-panel" aria-label="Location preview">
              <div className="map-grid" aria-hidden="true">
                <span className="service-area-ring map-service-area-ring" />
              </div>
              <div className="map-copy">
                <p className="eyebrow">Location precision</p>
                <h3>Service areas are not storefront pins.</h3>
                <p>
                  Exact pins appear only when canonical data confirms a public business location.
                  Service-area businesses stay represented as a broader geography.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="results-trust">
          <div className="shell results-trust-row">
            <p>
              This prelaunch preview uses sample listings. Live business names, locations, hours,
              actions, and availability will come only from verified directory data.
            </p>
            <a className="text-link" href="/maryland/harford-county">
              Explore Harford County →
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
