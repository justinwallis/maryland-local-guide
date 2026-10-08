import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

const serviceCategories = [
  "Masonry",
  "Landscaping",
  "Plumbing",
  "Roofing",
  "Water & Well",
  "Tree Service",
];

const communities = [
  { name: "Aberdeen", href: "/maryland/harford-county/aberdeen" },
  { name: "Havre de Grace", href: "/maryland/harford-county/havre-de-grace" },
  { name: "Bel Air", href: "/maryland/harford-county/bel-air" },
];

const projectSteps = [
  {
    step: "01",
    title: "Find local help",
    copy: "Start with a service professional who works in your community.",
    action: "Find services",
  },
  {
    step: "02",
    title: "Get materials",
    copy: "Keep the project moving with nearby suppliers and specialty materials.",
    action: "Browse suppliers",
  },
  {
    step: "03",
    title: "Rent equipment",
    copy: "Find practical rental options without turning the search into a statewide scavenger hunt.",
    action: "Find rentals",
  },
];

export default function Home() {
  return (
    <main id="main-content">
      <SiteHeader />

      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Harford County, Maryland</p>
            <h1>Find what you need, close to home.</h1>
            <p className="hero-lede">
              A practical local guide for finding trusted services, materials,
              rentals, places, and useful community resources.
            </p>

            <form className="search-panel" action="/search" method="get" role="search">
              <label>
                <span>What do you need help with?</span>
                <input
                  name="query"
                  placeholder="Try “masonry”, “well service”, or “roofing”"
                />
              </label>
              <label>
                <span>Community</span>
                <select name="community" defaultValue="harford">
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

            <p className="search-note">
              Search presentation is ready. Live directory results connect in
              the next implementation slice.
            </p>
          </div>

          <aside className="hero-card" aria-label="Launch area">
            <p className="eyebrow">Starting local</p>
            <h2>Built around how people actually get projects done.</h2>
            <p>
              Begin with Home Services, then connect the same need to nearby
              suppliers and equipment rental.
            </p>
            <div className="county-badge">
              <span className="county-dot" aria-hidden="true" />
              Harford County first
            </div>
          </aside>
        </div>
      </section>

      <section className="section shell" id="services">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Popular needs</p>
            <h2>Start with the job in front of you.</h2>
          </div>
          <a className="text-link" href="#services">Browse all services →</a>
        </div>

        <div className="chip-grid">
          {serviceCategories.map((category) => (
            <a className="category-chip" href="#services" key={category}>
              <span>{category}</span>
              <span aria-hidden="true">→</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section section-cream">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Solve a project locally</p>
              <h2>One need. Three useful next steps.</h2>
            </div>
          </div>

          <div className="project-grid">
            {projectSteps.map((item) => (
              <article className="project-card" key={item.step}>
                <span className="step-number">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <a className="text-link" href="#services">{item.action} →</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell" id="communities">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Explore nearby</p>
            <h2>Start with a community you know.</h2>
          </div>
          <a className="text-link" href="/maryland/harford-county">Explore Harford →</a>
        </div>

        <div className="community-grid">
          {communities.map((community) => (
            <article className="community-card" key={community.name}>
              <div className="community-art" aria-hidden="true">
                <span>Maryland</span>
              </div>
              <div>
                <p className="card-kicker">Harford County</p>
                <h3>{community.name}</h3>
                <p>Services, local resources, places, and practical guides.</p>
                <a className="text-link" href={community.href}>Explore {community.name} →</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="trust-band" id="resources">
        <div className="shell trust-grid">
          <div>
            <p className="eyebrow eyebrow-light">Local utility, not hype</p>
            <h2>Useful information should be easy to verify and easy to correct.</h2>
          </div>
          <div className="trust-copy">
            <p>
              Maryland Local Guide is an independent local resource. It is not a
              government website. Listing details, service areas, and map precision
              should reflect the best verified information available.
            </p>
            <a className="button button-light" href="#business">
              Suggest a correction
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
