# Directory Read Contract — Live Read Preflight

Status: **PUBLIC REST CONTRACT + CONTROLLED LIVE PAYLOAD VERIFIED**

The public frontend must not create a second source of listing truth. WordPress + Directorist remain authoritative for live directory data and search behavior.

## Verified public contract

The public WordPress REST root and Directorist namespaces are available unauthenticated:

- `wp/v2`
- `directorist/v1`
- `directorist/v2`
- `directorist`

Canonical directory types exposed by Directorist:

| ID | Slug | Name |
| --- | --- | --- |
| 2 | `home-services` | Home Services |
| 3 | `suppliers` | Suppliers |
| 4 | `equipment-rental` | Equipment & Rental |
| 5 | `places` | Places |
| 6 | `events` | Events |

The public taxonomy contract includes the Harford launch hierarchy and Home Services categories used by the frontend, including Masonry ID 19 and Aberdeen ID 10.

## Listing transport decision

Use **Directorist v2** for public listing search/detail payloads.

Why:

- v1 reliably exposes common listing fields and taxonomy relationships;
- the controlled acceptance record proved that the canonical Home Services builder fields are exposed in v2 under `fields`;
- `fields.custom-textarea` maps to **Services Offered**;
- `fields.custom-textarea-2` maps to **Service Area**;
- the same v2 `fields` object carries title, description, categories, locations, address, `map_hidden`, latitude and longitude.

The adapter may continue to use v1 for public directory/taxonomy discovery.

## Search/filter contract

The frontend may initially map only the approved subset:

- `search`
- `directory`
- `locations`
- `page`
- `per_page`
- `status=publish`

Radius remains absent until a later product decision and truthful geospatial behavior justify it.

## Controlled live acceptance — 2026-10-08

A clearly synthetic Home Services record was temporarily published and a companion synthetic record remained Pending.

Published fixture:

- post ID 64
- category Masonry
- community Aberdeen
- `map_hidden=true`
- no public address
- no latitude/longitude
- Services Offered populated
- Service Area populated

Pending companion:

- post ID 65
- same bounded synthetic QA family
- remained Pending

An unauthenticated GitHub-hosted GET-only acceptance run verified:

- published record HTTP 200;
- canonical ID/slug present;
- category mapping PASS;
- community mapping PASS;
- Services Offered field presence PASS;
- Service Area field presence PASS;
- service-area semantics PASS;
- v1 default query did not expose the Pending record;
- v1 explicit `status=pending` did not expose it;
- v1 `context=edit` did not expose it;
- v2 default query did not expose it;
- v2 explicit `status=pending` did not expose it;
- v2 `context=edit` did not expose it.

Acceptance result: **PASS**.

The evidence artifact intentionally stored only statuses, counts, IDs, booleans and presence signals. It did not store custom-field values.

After evidence capture, both synthetic records were moved to Trash and the public Directorist listing collection returned to zero records.

## Location semantics

A record is treated as an exact public location only when all of these are true:

1. map is not hidden;
2. public address is present;
3. latitude is valid;
4. longitude is valid.

Otherwise it remains a service-area record and must not render as a storefront pin.

## Publication boundary

The frontend adapter:

- explicitly requests `status=publish`;
- rejects any non-published record returned upstream;
- never relies on authenticated/admin-only fields;
- does not fabricate missing contact, rating, hours, availability, verification, address or coordinates.

## Activation posture

The live adapter is technically accepted for the verified Home Services read shape, but **representative remains the default provider** until a deliberate runtime activation step.

The second gate `MLG_LIVE_DIRECTORY_ACCEPTED=true` remains required. Noindex/robots restrictions remain separate and must not be removed merely because the data adapter passed.

## Repeatable evidence

Repository assets:

- `scripts/probe-directorist-read.mjs`
- `Directorist Read Preflight` workflow
- `scripts/verify-live-listing-acceptance.mjs`
- `Live Listing Acceptance` workflow

These are the repeatable read-only evidence paths for future Directorist upgrades or builder changes.
