# Directory Read Contract — Preflight

Status: **LIVE TRANSPORT UNVERIFIED / REPRESENTATIVE ADAPTER ACTIVE**

The public frontend must not create a second source of listing truth. WordPress + Directorist remain authoritative for live directory data and search behavior.

## Verified in the frontend

- Search/result and listing-detail pages consume one `DirectoryReadAdapter` seam.
- Representative data is centralized and explicitly marked non-live.
- Any attempt to select a non-representative provider fails closed.
- Service-area and exact-location records are separate contract shapes.
- UI does not require ratings, prices, hours, coordinates, verification, or availability.

## Live WordPress / Directorist items still to verify

Before implementing a live adapter, capture the exact current read contract for:

1. REST namespace and endpoint(s) for public listings.
2. Public post type / directory-type identifiers.
3. Keyword, category, community and pagination parameters.
4. Result fields needed for cards: canonical ID/slug, title, category, community/service area, public URL, media only when rights-approved.
5. Listing fields needed for detail: Description, Services Offered, Service Area and supported public actions.
6. Exact-location fields and the canonical hidden-map/service-area signal. Never infer a storefront from a community/service-area record.
7. Public taxonomy endpoints and canonical category/community IDs/slugs.
8. Authentication behavior for public reads versus owner/admin-only fields.
9. Stable error, empty and pagination semantics.
10. Cache/SEO behavior for server-rendered requests.

## Stop conditions

Do not connect live data if the endpoint requires private/admin fields, exposes draft/Pending records, conflates service areas with storefront coordinates, changes Directorist search semantics, or cannot preserve the canonical moderation/provenance boundary.

## Current transport blocker

The 2026-10-07 WPVibe usage check reported **0 of 100 calls remaining** in the rolling window. Public-network access from the implementation sandbox was also unavailable. Therefore current live endpoint verification was not claimed in this change.
