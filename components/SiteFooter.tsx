import { BrandLogo } from "./BrandLogo";

export function SiteFooter() {
  return (
    <footer className="footer" id="business">
      <div className="shell footer-grid">
        <div>
          <a className="brand brand-footer" href="/" aria-label="Maryland Local Guide home">
            <BrandLogo className="brand-picture-footer" />
          </a>
          <p className="footer-copy">
            Harford County first. Built to make local discovery more useful.
          </p>
        </div>

        <div>
          <h3>Explore</h3>
          <a href="/search?community=harford">Find Services</a>
          <a href="/maryland/harford-county">Communities</a>
          <a href="/maryland/harford-county#local-guides">Places</a>
        </div>

        <div>
          <h3>For businesses</h3>
          <p className="footer-status">Add your business <span>Opens before launch</span></p>
          <p className="footer-status">Update a listing <span>Opens before launch</span></p>
          <p className="footer-status">Suggest a correction <span>Opens before launch</span></p>
        </div>

        <div>
          <h3>About</h3>
          <a href="/guides/planning-a-home-project">How it works</a>
          <a href="/#resources">Trust & sources</a>
        </div>
      </div>
    </footer>
  );
}
