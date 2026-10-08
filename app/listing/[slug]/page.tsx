import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../../components/SiteFooter";
import { SiteHeader } from "../../../components/SiteHeader";
import { getDirectoryReadAdapter } from "../../../lib/directory/provider";

type ListingPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getDirectoryReadAdapter().getListing(slug);

  if (!listing) {
    return {
      title: "Local Listing",
      description: "Maryland Local Guide listing information.",
    };
  }

  return {
    title: listing.title,
    description: listing.summary,
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const directory = getDirectoryReadAdapter();
  const listing = await directory.getListing(slug);

  if (!listing) {
    notFound();
  }

  const isExact = listing.locationMode === "exact";

  return (
    <>
      <SiteHeader />

      <main id="main-content">
        <section className="listing-hero">
          <div className="shell">
            <p className="breadcrumb">Maryland / Harford County / {listing.category}</p>
            <div className="listing-hero-grid">
              <div>
                <div className="listing-meta-row">
                  <span className="result-category">{listing.category}</span>
                  <span className="precision-badge">{listing.precisionLabel}</span>
                </div>
                <h1 className="listing-title">{listing.title}</h1>
                <p className="listing-location">{listing.locationLabel}</p>
                <p className="listing-preview-note">
                  Preview listing — example content, not a published business record.
                </p>
                <div className="listing-actions" aria-label="Listing actions">
                  <button className="button button-gold" type="button" disabled>Call</button>
                  <button className="button button-secondary" type="button" disabled>Website</button>
                  <button className="button button-secondary" type="button" disabled>Directions</button>
                </div>
              </div>

              <div className="listing-image" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="listing-section shell">
          <div className="listing-main">
            <div className="listing-content">
              <article className="detail-card">
                <p className="eyebrow">Overview</p>
                <h2>Description</h2>
                <p>{listing.description}</p>
              </article>

              <article className="detail-card">
                <p className="eyebrow">What this listing offers</p>
                <h2>Services Offered</h2>
                <ul className="service-list">
                  {listing.services.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
              </article>

              <article className="detail-card">
                <p className="eyebrow">Where they work</p>
                <h2>Service Area</h2>
                <p>{listing.serviceArea}</p>
                <p className="detail-muted">{listing.locationDetail}</p>
              </article>

              <article className="detail-card correction-card">
                <div>
                  <p className="eyebrow">Keep local information useful</p>
                  <h2>See something that needs correcting?</h2>
                  <p>
                    Correction intake will open before public launch after the legal, moderation,
                    and mail-delivery checks are complete.
                  </p>
                </div>
                <button className="button button-secondary" type="button" disabled>
                  Correction intake not yet open
                </button>
              </article>
            </div>

            <aside className="listing-sidebar">
              <article className="location-card">
                <div className={isExact ? "location-visual exact-location" : "location-visual service-area"}>
                  {isExact ? <span className="single-pin" aria-hidden="true" /> : <span className="service-area-ring" aria-hidden="true" />}
                </div>
                <div className="location-copy">
                  <p className="eyebrow">Location precision</p>
                  <h3>{isExact ? "Exact public location available." : "Service area, not a storefront."}</h3>
                  <p>
                    {isExact
                      ? "A storefront pin should appear only when canonical data confirms a public exact location."
                      : "A service-area business should show the geography it serves without implying a walk-in address."}
                  </p>
                </div>
              </article>

              <article className="freshness-card">
                <p className="eyebrow">Source & freshness</p>
                <h3>Live source details arrive with canonical data.</h3>
                <p>
                  Update dates, source history, moderation state, and verification language
                  stay hidden until the backend contract supplies them.
                </p>
              </article>
            </aside>
          </div>
        </section>

        <section className="listing-proof">
          <div className="shell listing-proof-row">
            <p>
              This preview intentionally omits ratings, prices, hours, phone numbers, addresses,
              coordinates, availability, and verification claims.
            </p>
            <a className="text-link" href="/search?community=harford">
              Back to search →
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
