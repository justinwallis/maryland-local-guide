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
    <main>
      <SiteHeader />

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
            <p className="eyebrow">Representative guide state</p>
            <h2>Useful before decorative.</h2>
            <p>
              This template is designed for practical local guidance, readable long-form
              content, and clearly separated source/provenance context.
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
                Checklist state stays in your browser only in this prototype. It is not saved,
                submitted, or attached to a business record.
              </p>
            </section>
          ) : null}

          <section className="guide-source-note">
            <p className="eyebrow">Source & freshness boundary</p>
            <h2>Published facts need traceable support.</h2>
            <p>
              This representative guide intentionally avoids live regulations, pricing,
              contractor claims, addresses, schedules, or business facts. Production content
              should carry an appropriate source/update trail before publication.
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
              County/community context should stay visible so a reader can tell whether advice
              is statewide, county-level, community-specific, or general.
            </p>
            <a className="text-link" href="/maryland/harford-county">
              Explore Harford County →
            </a>
          </div>

          <div className="guide-side-card">
            <p className="eyebrow">Found an issue?</p>
            <h3>Help keep the guide useful.</h3>
            <p>
              Correction intake remains subject to the canonical moderation/mail gates.
            </p>
            <a className="button button-secondary" href="/#business">
              Suggest a correction
            </a>
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

      <SiteFooter />
    </main>
  );
}
