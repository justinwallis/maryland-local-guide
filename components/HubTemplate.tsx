import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

type CommunityLink = {
  name: string;
  slug: string;
};

type HubTemplateProps = {
  title: string;
  eyebrow: string;
  description: string;
  searchCommunity: string;
  breadcrumb: string;
  contextLabel: string;
  communities?: CommunityLink[];
};

const categories = [
  "Masonry",
  "Landscaping",
  "Plumbing",
  "Roofing",
  "Water & Well",
  "Tree Service",
];

export function HubTemplate({
  title,
  eyebrow,
  description,
  searchCommunity,
  breadcrumb,
  contextLabel,
  communities = [],
}: HubTemplateProps) {
  return (
    <main>
      <SiteHeader />

      <section className="hub-hero">
        <div className="shell">
          <p className="breadcrumb">{breadcrumb}</p>
          <div className="hub-hero-grid">
            <div>
              <p className="eyebrow">{eyebrow}</p>
              <h1 className="hub-title">{title}</h1>
              <p className="hub-lede">{description}</p>
              <span className="preview-badge">Representative hub state</span>
            </div>
            <div className="hub-visual" aria-label="Representative Maryland local image area">
              <span>{contextLabel}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="hub-section shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Start here</p>
            <h2>Useful local paths before endless browsing.</h2>
          </div>
        </div>

        <div className="hub-action-grid">
          <a className="hub-action-card" href={`/search?community=${searchCommunity}`}>
            <span className="hub-action-number">01</span>
            <h3>Find services</h3>
            <p>Start with practical Home Services and narrow from there.</p>
            <span className="text-link">Search local services →</span>
          </a>
          <a className="hub-action-card" href="/#services">
            <span className="hub-action-number">02</span>
            <h3>Materials & rentals</h3>
            <p>Keep a project moving from contractor to supplier to equipment.</p>
            <span className="text-link">Follow the project path →</span>
          </a>
          <a className="hub-action-card" href="#local-guides">
            <span className="hub-action-number">03</span>
            <h3>Guides & local context</h3>
            <p>Use practical area information without pretending every module is live inventory.</p>
            <span className="text-link">Browse representative guides →</span>
          </a>
        </div>
      </section>

      <section className="hub-section hub-section-cream">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Popular needs</p>
              <h2>Jump into a useful service category.</h2>
            </div>
          </div>

          <div className="chip-grid">
            {categories.map((category) => (
              <a
                className="category-chip"
                href={`/search?query=${encodeURIComponent(category)}&community=${searchCommunity}`}
                key={category}
              >
                <span>{category}</span>
                <span aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {communities.length > 0 ? (
        <section className="hub-section shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Communities</p>
              <h2>Explore Harford County at a more local level.</h2>
            </div>
          </div>
          <div className="hub-community-grid">
            {communities.map((community) => (
              <a className="hub-community-card" href={`/maryland/harford-county/${community.slug}`} key={community.slug}>
                <div className="hub-community-art" aria-hidden="true">
                  <span>Maryland</span>
                </div>
                <div>
                  <p className="card-kicker">Harford County</p>
                  <h3>{community.name}</h3>
                  <p>Services, useful local paths, guides, and representative discovery modules.</p>
                  <span className="text-link">Explore {community.name} →</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="hub-section shell" id="local-guides">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Local context</p>
            <h2>Room for useful guides and places—without fake inventory.</h2>
          </div>
        </div>

        <div className="hub-editorial-grid">
          <a className="hub-editorial-card" href="/guides/planning-a-home-project">
            <div className="hub-editorial-art" aria-hidden="true">Guide image area</div>
            <div>
              <p className="card-kicker">Representative guide module</p>
              <h3>Plan a home project</h3>
              <p>
                A reusable long-form guide and practical checklist using the approved editorial system.
              </p>
              <span className="text-link">Read the guide →</span>
            </div>
          </a>

          <article className="hub-editorial-card">
            <div className="hub-editorial-art" aria-hidden="true">Place image area</div>
            <div>
              <p className="card-kicker">Representative places module</p>
              <h3>Browse local places</h3>
              <p>
                Real Places appear only after provenance and launch gates support them.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="trust-band hub-trust">
        <div className="shell trust-grid">
          <div>
            <p className="eyebrow eyebrow-light">Know the scope</p>
            <h2>{contextLabel} context should always be obvious.</h2>
          </div>
          <div className="trust-copy">
            <p>
              Maryland Local Guide is an independent local resource, not a government website.
              Hub content, listing facts, place status, and map precision remain subject to the
              same provenance and correction rules as the rest of the product.
            </p>
            <a className="button button-light" href="/#business">
              Suggest a correction
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
