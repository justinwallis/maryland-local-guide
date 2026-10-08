"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" className="state-page" role="alert">
      <div className="shell state-shell">
        <p className="eyebrow">Something went wrong</p>
        <h1>We couldn’t load this view.</h1>
        <p>
          The page did not complete normally. You can retry without losing the rest of the site navigation context.
        </p>
        <div className="state-actions">
          <button className="button button-gold" type="button" onClick={() => reset()}>
            Try again
          </button>
          <a className="button button-secondary" href="/">
            Return home
          </a>
        </div>
      </div>
    </main>
  );
}
