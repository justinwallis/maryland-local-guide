export default function Loading() {
  return (
    <main id="main-content" className="state-page" aria-live="polite" aria-busy="true">
      <div className="shell state-shell">
        <p className="eyebrow">Maryland Local Guide</p>
        <h1>Loading local information…</h1>
        <p>Keeping the page structure steady while the next view is prepared.</p>
        <div className="state-skeleton" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </main>
  );
}
