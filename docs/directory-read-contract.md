# Directory Read Contract — Preflight

Status: **PUBLIC TRANSPORT VERIFIED / LIVE LISTING PAYLOAD NOT YET AVAILABLE**

WordPress + Directorist remain authoritative for live directory data and search behavior. The modern frontend must not become a second source of listing truth.

## Verified live on marylandlocalguide.com

Read-only public probing from GitHub Actions succeeded on 2026-10-08 UTC. No authentication, write request, user endpoint, or raw pending/draft listing value was used.

- `/wp-json/` returns HTTP 200 JSON.
- Advertised namespaces include `directorist/v1`, `directorist/v2`, and `wp/v2`.
- The WordPress listing post type is `at_biz_dir`.
- Directorist publicly advertises GET collection/single-listing routes in both v1 and v2.
- Both v1 and v2 listing collections currently return HTTP 200 with **0 published listings**.
- Public Directorist taxonomy reads are available even while listing counts are zero.
- The public category set currently contains 31 configured terms.
- The public location set currently contains 16 configured terms.

### Directory types

The public Directorist directory registry currently exposes:

| ID | Slug | Name | Default | Public count |
| --- | --- | --- | --- | ---: |
| 2 | `home-services` | Home Services | yes | 0 |
| 3 | `suppliers` | Suppliers | no | 0 |
| 4 | `equipment-rental` | Equipment & Rental | no | 0 |
| 5 | `places` | Places | no | 0 |
| 6 | `events` | Events | no | 0 |

Current directory create/edit status values are `pending`. That is configuration evidence, not proof that unauthenticated clients can read pending listings.

### Location hierarchy

The configured public hierarchy is:

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

All five directory types currently reference the same configured location hierarchy.

### Category mapping

Configured category terms are already mapped to directory IDs. Examples verified live:

- Home Services (directory 2): Masonry, Landscaping, Plumbing, Electrical, Roofing, HVAC, Water & Well, Septic, Tree Service, Fencing, Concrete, Excavation, Drainage, Painting, Cleaning, Handyman, General Contractor & Remodeling.
- Suppliers (directory 3): Building & Lumber Supply, Landscape & Masonry Supply, Nurseries & Garden Centers, Stone/Mulch/Topsoil.
- Equipment & Rental (directory 4): Tool Rental, Heavy Equipment Rental, Dumpster Rental, Trailer Rental.
- Places (directory 5): Parks & Trails, Attractions & Museums, Public & Community Resources.
- Events (directory 6): Community Events, Markets & Festivals, Classes & Workshops.

Do not duplicate these mappings in a second CMS. Runtime adapters should resolve canonical Directorist terms by stable slug/ID and preserve their directory relationship.

## Verified listing collection contract

Unauthenticated `OPTIONS` on both v1 and v2 listing collections returns HTTP 200.

The public GET collections advertise these filter arguments:

- `search`
- `directory`
- `categories`
- `locations`
- `tags`
- `slug`
- `include` / `exclude`
- `author`
- `featured`
- `min_price` / `max_price` / `price_range`
- `rating`
- `radius`
- `status`
- `page` / `per_page` / `offset`
- `order` / `orderby`
- `context`

The existence of `radius` in the API is **not** permission to expose distance/radius in the launch UI. The canonical MLG roadmap still requires truthful location semantics first.

### v1 listing schema

The live v1 collection schema advertises fields including:

`id`, `name`, `slug`, `status`, `directory`, `description`, `short_description`, `categories`, `locations`, `address`, `latitude`, `longitude`, `map_hidden`, `phone`, `phone_2`, `website`, `email`, `images`, `social_links`, `tagline`, `tags`, `featured`, `average_rating`, `rating_count`, `reviews_allowed`, dates, pricing fields, and provenance-adjacent counters.

This makes v1 the clearer candidate for the first read adapter because the public schema exposes the listing fields directly.

### v2 listing schema

The live v2 collection exists and returns HTTP 200. Its schema is more normalized and exposes a generic `fields` payload plus core fields such as `id`, `slug`, `status`, `directory`, `permalink`, timestamps, rating counters, `timezone`, and related IDs.

Do not choose v2 solely because it is newer. Choose the minimum contract that can be mapped and verified against actual MLG listing data.

## Unauthenticated boundary check

The probe requested counts/status only for:

- v1 `status=pending`
- v1 `status=draft`
- v1 `context=edit`
- v2 `status=pending`

All returned HTTP 200 with total 0/body count 0. No pending/draft/edit record values were captured.

Because the site currently exposes zero listings, this result does **not** prove that future pending/draft records are safely blocked. Re-run this boundary check after a controlled non-public test record exists, and fail closed if unauthenticated reads expose it.

## Frontend contract already verified

- Search/results and listing-detail pages consume one `DirectoryReadAdapter` seam.
- Representative data is centralized and explicitly marked non-live.
- Any attempt to select a non-representative provider fails closed.
- Service-area and exact-location UI states are separate.
- The UI does not require ratings, prices, hours, coordinates, verification, or availability.

## Remaining live proof before enabling a real adapter

The public transport layer itself is no longer the blocker. The missing proof is a **real, controlled listing payload**.

Before enabling a live adapter:

1. Inspect one controlled Home Services listing through WPVibe/admin read access after capacity returns, or create/use an already-authorized non-public test fixture.
2. Verify the actual value shape for Description, Services Offered, Service Area, category, location, public URL, and supported contact actions.
3. Verify how `map_hidden`, `latitude`, `longitude`, address and location terms distinguish an exact storefront from a service-area business.
4. Verify that default unauthenticated collection reads include only publish-safe records.
5. Re-run the pending/draft/edit boundary check while a controlled non-public record actually exists.
6. Verify keyword/category/community pagination behavior with at least one publish-safe listing before replacing representative Search/Listing fixtures.

## Stop conditions

Do not enable live frontend data if:

- unauthenticated reads expose draft/pending/private records;
- service-area records can be mistaken for exact storefront coordinates;
- the adapter would change Directorist search semantics;
- a required field depends on private/admin-only data;
- the mapping requires fabricated ratings, addresses, coordinates, hours, verification, or availability;
- the frontend would become a second listing source of truth.

## Reusable probe

`scripts/probe-directorist-read.mjs` performs the bounded public REST preflight. The companion GitHub Actions workflow is manual-only after this verification pass. It uses GET/OPTIONS only and intentionally avoids user endpoints and raw pending/draft record output.

The frontend remains `noindex` and representative-only until the later explicit launch/data gate.
