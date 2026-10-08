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
          <a href="/#services">Find Services</a>
          <a href="/#communities">Communities</a>
          <a href="/#places">Places</a>
        </div>

        <div id="places">
          <h3>For businesses</h3>
          <a href="/#business">Add Your Business</a>
          <a href="/#business">Update a Listing</a>
          <a href="/#business">Suggest a Correction</a>
        </div>

        <div>
          <h3>About</h3>
          <a href="/#resources">How it works</a>
          <a href="/#resources">Trust & sources</a>
          <a href="/#resources">Contact</a>
        </div>
      </div>
    </footer>
  );
}
