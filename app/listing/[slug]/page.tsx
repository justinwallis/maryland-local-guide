import { notFound } from "next/navigation";
import { SiteFooter } from "../../../components/SiteFooter";
import { SiteHeader } from "../../../components/SiteHeader";

type ListingPageProps = {
  params: Promise<{ slug: string }>;
};

type RepresentativeListing = {
  title: string;
  category: string;
  locationLabel: string;
  locationDetail: string;
  precision: "Service area" | "Exact-location record";
  description: string;
  services: string[];
  serviceArea: string;
  locationMode: "service-area" | "exact";
};

const listings: Record<string, RepresentativeListing> = {
  "service-area-preview": {
    title: "Representative masonry service",
    category: "Masonry",
    locationLabel: "Aberdeen & surrounding Harford County",
    locationDetail: "Service-area record; no storefront pin should be implied.",
    precision: "Service area",
    description:
      "This representative state demonstrates the approved listing-detail hierarchy without using a real business name, rating, phone number, address, hours, or verification claim.",
    services: ["Masonry repair", "Brick & block work", "Small project consultation"],
    serviceArea: "Aberdeen and surrounding Harford County communities",
    locationMode: "service-area",
  },
  "exact-location-preview": {
    title: "Representative supplier storefront",
    category: "Supplier",
    locationLabel: "Public storefront location",
    locationDetail: "Representative exact-location state — not live directory data.",
    precision: "Exact-location record",
    description:
      "This second representative state proves the exact-location version of the same listing template while keeping all factual business data out of the prototype.",
    services: ["Building materials", "Project supplies", "Local pickup"],
    serviceArea: "Public storefront plus the service area supplied by the canonical record",
    locationMode: "exact",
  },
};

export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const listing = listings[slug];

  if (!listing) {
    notFound();
  }

  const isExact = listing.locationMode === "exact";

  return (
    <main id="main-content">
      <SiteHeader />

      <section className="listing-hero">
        <div className="shell">
          <p className="breadcrumb">Maryland / Harford County / {listing.category}</p>
          <div className="listing-hero-grid">
            <div>
              <div className="listing-meta-row">
                <span className="result-category">{listing.category}</span>
                <span className="precision-badge">{listing.precision}</span>
              </div>
              <h1 className="listing-title">{listing.title}</h1>
              <p className="listing-location">{listing.locationLabel}</p>
              <p className="listing-preview-note">
                Representative UI state — not a published business listing.
              </p>
              <div className="listing-actions" aria-label="Representative listing actions">
                <span className="button button-gold button-static">Call</span>
                <span className="button button-secondary button-static">Website</span>
                <span className="button button-secondary button-static">Directions</span>
                <span className="button button-secondary button-static">Save</span>
              </div>
            </div>

            <div className="listing-image" aria-label="Representative image area">
              <span>Representative image area</span>
            </div>
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
                  The public correction/update workflow remains owned by the canonical
                  moderation and mail gates. This surface only reserves the approved entry point.
                </p>
              </div>
              <a className="button button-gold" href="/#business">
                Suggest a correction
              </a>
            </article>
          </div>

          <aside className="listing-sidebar">
            <article className="location-card">
              <div className={isExact ? "location-visual exact-location" : "location-visual service-area"}>
                {isExact ? <span className="single-pin" aria-hidden="true" /> : <span className="service-area-ring" aria-hidden="true" />}
              </div>
              <div className="location-copy">
                <p className="eyebrow">Location truthfulness</p>
                <h3>{isExact ? "Exact location can support a storefront pin." : "Service area is not a storefront pin."}</h3>
                <p>
                  {isExact
                    ? "Final address and coordinates appear only when canonical data confirms a public exact location."
                    : "The final map should describe the served geography without implying a precise public address."}
                </p>
              </div>
            </article>

            <article className="freshness-card">
              <p className="eyebrow">Freshness & provenance</p>
              <h3>Source status belongs to the canonical record.</h3>
              <p>
                Live update dates, source history, moderation state, and verification language
                will render only when the backend contract supplies them.
              </p>
            </article>
          </aside>
        </div>
      </section>

      <section className="listing-proof">
        <div className="shell listing-proof-row">
          <p>
            No ratings, prices, hours, phone numbers, addresses, coordinates, availability, or
            “verified” claims are fabricated in this prototype.
          </p>
          <a className="text-link" href={isExact ? "/listing/service-area-preview" : "/listing/exact-location-preview"}>
            View {isExact ? "service-area" : "exact-location"} variant →
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
