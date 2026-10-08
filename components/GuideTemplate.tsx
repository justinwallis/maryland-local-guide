import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

type GuideSection = {
  heading: string;
  body: readonly string[];
};

type GuideTemplateProps = {
  title: string;
  eyebrow: string;
  dek: string;
  areaLabel: string;
  updatedLabel: string;
  readingTime: string;
  takeaways: readonly string[];
  sections: readonly GuideSection[];
  relatedServices: readonly string[];
  toolTitle?: string;
  toolIntro?: string;
  toolItems?: readonly string[];
};

export function GuideTemplate({
  title,
  eyebrow,
  dek,
  areaLabel,
  updatedLabel,
  readingTime,
  takeaways,
  sections,
  relatedServices,
  toolTitle,
  toolIntro,
  toolItems = [],
}: GuideTemplateProps) {
  return (
    <>
      <SiteHeader />

      <main id="main-content">
        <section className="guide-hero">
          <div className="shell guide-hero-grid">
            <div>
              <p className="breadcrumb">Maryland / Harford County / Resources</p>
              <p className="eyebrow">{eyebrow}</p>
              <h1 className="guide-title">{title}</h1>
              <p className="guide-dek">{dek}</p>
              <div className="guide-meta" aria-label="Guide metadata">
                <span>{areaLabel}</span>
                <span>{updatedLabel}</span>
                <span>{readingTime}</span>
              </div>
            </div>

            <aside className="guide-hero-card">
              <p className="eyebrow">Guide preview</p>
              <h2>Useful before decorative.</h2>
              <p>
                Practical local guidance should be readable, scoped to the right place,
                and clear about where its facts come from.
              </p>
            </aside>
          </div>
        </section>

        <section className="guide-shell shell">
          <article className="guide-article">
            <section className="guide-takeaways" aria-labelledby="guide-takeaways-title">
              <p className="eyebrow">Quick read</p>
              <h2 id="guide-takeaways-title">What to know first</h2>
              <ul>
                {takeaways.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            {sections.map((section) => (
              <section className="guide-section" key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}

            {toolTitle && toolItems.length > 0 ? (
              <section className="guide-tool" aria-labelledby="guide-tool-title">
                <p className="eyebrow">Practical tool</p>
                <h2 id="guide-tool-title">{toolTitle}</h2>
                {toolIntro ? <p>{toolIntro}</p> : null}
                <form className="guide-checklist">
                  {toolItems.map((item, index) => (
                    <label key={item}>
                      <input type="checkbox" />
                      <span>
                        <strong>{String(index + 1).padStart(2, "0")}</strong>
                        {item}
                      </span>
                    </label>
                  ))}
                </form>
                <p className="tool-note">
                  Checklist selections stay in your browser. They are not saved, submitted,
                  or attached to a business record.
                </p>
              </section>
            ) : null}

            <section className="guide-source-note">
              <p className="eyebrow">Source & freshness</p>
              <h2>Published facts need traceable support.</h2>
              <p>
                This prelaunch guide avoids live regulations, pricing, contractor claims,
                addresses, schedules, and business facts. Production content should carry
                an appropriate source and update trail before publication.
              </p>
            </section>
          </article>

          <aside className="guide-sidebar">
            <div className="guide-side-card">
              <p className="eyebrow">Related local services</p>
              <h3>Move from reading to action.</h3>
              <div className="guide-service-links">
                {relatedServices.map((service) => (
                  <a
                    key={service}
                    href={`/search?query=${encodeURIComponent(service)}&community=harford`}
                  >
                    <span>{service}</span>
                    <span aria-hidden="true">→</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="guide-side-card guide-local-card">
              <p className="eyebrow">Local context</p>
              <h3>Harford County first.</h3>
              <p>
                County and community context stays visible so readers can tell whether
                guidance is statewide, county-level, community-specific, or general.
              </p>
              <a className="text-link" href="/maryland/harford-county">
                Explore Harford County →
              </a>
            </div>

            <div className="guide-side-card">
              <p className="eyebrow">Found an issue?</p>
              <h3>Help keep the guide useful.</h3>
              <p>
                Public correction intake opens after the legal, moderation, and mail checks are complete.
              </p>
              <button className="button button-secondary" type="button" disabled>
                Correction intake not yet open
              </button>
            </div>
          </aside>
        </section>

        <section className="guide-bottom">
          <div className="shell guide-bottom-row">
            <p>
              Maryland Local Guide is an independent local resource, not a government website.
            </p>
            <a className="text-link" href="/maryland/harford-county">
              Back to Harford County →
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
