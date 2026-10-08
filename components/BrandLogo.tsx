type BrandLogoProps = {
  compactOnMobile?: boolean;
  className?: string;
};

export function BrandLogo({
  compactOnMobile = false,
  className = "",
}: BrandLogoProps) {
  return (
    <picture className={`brand-picture ${className}`.trim()}>
      {compactOnMobile ? (
        <source media="(max-width: 680px)" srcSet="/android-chrome-192x192.png" />
      ) : null}
      <img
        className="brand-logo"
        src="/maryland-local-guide-logo-header-dark-900.png"
        alt="Maryland Local Guide"
        width={900}
        height={305}
      />
    </picture>
  );
}
