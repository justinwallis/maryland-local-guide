# Directory Read Contract — Live Read Preflight

Status: **PUBLIC REST CONTRACT VERIFIED / LIVE LISTING PAYLOAD STILL UNAVAILABLE**

The public frontend must not create a second source of listing truth. WordPress + Directorist remain authoritative for live directory data and search behavior.

## Verified from marylandlocalguide.com — 2026-10-07

A bounded unauthenticated GET/OPTIONS probe ran from GitHub Actions against the public site. It used no admin session, sent no write method, queried no user endpoint, and stored no raw listing values.

### REST availability

- `/wp-json/` → HTTP 200
- WordPress namespace: `wp/v2`
- Directorist namespaces: `directorist/v1`, `directorist/v2`, `directorist`
- Directorist public listing collections:
  - `GET /wp-json/directorist/v1/listings`
  - `GET /wp-json/directorist/v2/listings`
- Both listing collections currently return HTTP 200 with **0 public listings**.

### Canonical directory types

The public Directorist directories endpoint currently exposes:

| ID | Slug | Name | Default | Public Count | New/Edit Status |
| --- | --- | --- | --- | ---: | --- |
| 2 | `home-services` | Home Services | yes | 0 | pending / pending |
| 3 | `suppliers` | Suppliers | no | 0 | pending / pending |
| 4 | `equipment-rental` | Equipment & Rental | no | 0 | pending / pending |
| 5 | `places` | Places | no | 0 | pending / pending |
| 6 | `events` | Events | no | 0 | pending / pending |

This matches the intended Harford MVP information architecture.

### Public taxonomy contract

`GET /directorist/v1/listings/categories` currently exposes **31 categories**.

Examples relevant to the launch wedge:

- Masonry — ID 19 — Home Services
- Landscaping — ID 20 — Home Services
- Plumbing — ID 21 — Home Services
- Electrical — ID 22 — Home Services
- Roofing — ID 23 — Home Services
- HVAC — ID 24 — Home Services
- Water & Well — ID 25 — Home Services
- Septic — ID 26 — Home Services
- Tree Service — ID 27 — Home Services
- Fencing — ID 28 — Home Services
- Concrete — ID 29 — Home Services
- Excavation — ID 30 — Home Services
- Drainage — ID 31 — Home Services
- Painting — ID 32 — Home Services
- Cleaning — ID 33 — Home Services
- Handyman — ID 34 — Home Services
- General Contractor & Remodeling — ID 54 — Home Services

`GET /directorist/v1/listings/locations` currently exposes **16 location terms**.

The verified launch hierarchy includes:

- Maryland — ID 8
  - Harford County — ID 9
    - Aberdeen — ID 10
    - Havre de Grace — ID 11
    - Bel Air — ID 12
    - Fallston — ID 13
    - Forest Hill — ID 14
    - Abingdon — ID 15
    - Edgewood — ID 16
    - Joppa — ID 17
    - Joppatowne — ID 18
    - Street — ID 49
    - Jarrettsville — ID 50
    - Pylesville — ID 51
    - Churchville — ID 52
    - Monkton — ID 53

### Listing search/filter contract

OPTIONS for the v1 listing collection verifies public GET arguments including:

- `search`
- `directory`
- `categories`
- `locations`
- `page`
- `per_page`
- `offset`
- `order`
- `orderby`
- `status`
- `slug`
- `include` / `exclude`
- `featured`
- `tags`
- `rating`
- `radius`
- price-related filters

The frontend should initially map only the already-approved subset: keyword, directory, category, location/community, page/per-page. Radius remains disabled until location semantics are proven with real records.

### v1 listing schema fields

The advertised v1 schema includes fields needed for the eventual adapter, including:

- `id`, `slug`, `name`, `permalink`
- `directory`
- `categories`, `locations`, `tags`
- `description`, `short_description`, `tagline`
- `address`, `zip`
- `latitude`, `longitude`
- `map_hidden`
- `website`, `phone`, `phone_2`, `email`, `fax`
- `images`
- `status`
- `date_created`, `date_modified`
- `average_rating`, `rating_count`, `reviews_allowed`
- `featured`, `popular`, `views_count`

The UI is **not** required to render most of these. Unsupported or unverified fields should remain omitted.

## Current visibility-boundary observation

Unauthenticated probes for `status=pending`, `status=draft`, and `context=edit` returned HTTP 200 with zero records. No unpublished data was observed or stored.

This is **not yet proof** of permission behavior when unpublished records exist. Do not rely on it as an authorization guarantee.

## What remains unverified

Because the public listing count is currently zero, we still cannot verify against a real published record:

1. exact live item response shape and field population;
2. whether Home Services single-listing custom fields map directly into v1 properties or require v2 `fields`;
3. service-area versus storefront behavior using `map_hidden`, locations, address and coordinates;
4. keyword/category/location filter semantics against actual published listings;
5. pagination behavior beyond the zero-result state;
6. public-detail lookup by ID/slug against a real record;
7. server-rendered cache/freshness behavior against changing live data.

## Frontend adapter rule

A live adapter may now be **implemented and tested behind the existing fail-closed provider switch**, because the public endpoint names, search arguments, taxonomy IDs/slugs, directory IDs/slugs and advertised schema are verified.

It must **not become the default provider** until at least one safe published listing exists and the mapping/location semantics pass read-only acceptance.

## Stop conditions

Do not enable live data if the adapter:

- exposes draft/Pending/private records;
- treats service-area businesses as exact storefront pins;
- changes Directorist search semantics;
- requires private/admin fields for public rendering;
- fabricates missing address, rating, availability, verification or contact state;
- bypasses the canonical moderation/provenance boundary.

## Repeatable evidence

The repository includes `scripts/probe-directorist-read.mjs` and the `Directorist Read Preflight` GitHub Actions workflow so this read-only contract can be rechecked after WordPress/Directorist changes.
