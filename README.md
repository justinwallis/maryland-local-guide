# Maryland Local Guide

Modern public frontend for Maryland Local Guide.

## Architecture

- **Frontend:** Next.js / React
- **Canonical directory/CMS layer:** WordPress + Directorist
- **Launch geography:** Harford County, Maryland
- **Design authority:** Maryland Local Guide — UI & Experience Roadmap
- **Visual system:** Maryland Utility Editorial
- **Canonical brand assets:** Maryland Local Guide — Brand Assets & Logo Masters
- **Directory data seam:** fail-closed `DirectoryReadAdapter`

The frontend must not become a second source of listing truth or invent search semantics that conflict with the canonical WordPress/Directorist model.

## Current checkpoint

Merged and verified before this branch:
- Slice 01 — Shell + Home
- Slice 02 — Search / Results
- Slice 03 — Listing Detail
- Slice 04 — County / Community Hubs
- Slice 05 — Guides / Tools
- Slice 08 — Responsive / Accessibility / State Polish
- Directory Read Adapter scaffold
- Prelaunch noindex / robots safety defaults

Slices 06 and 07 remain gated by canonical launch QA.

## Production-readiness branch

`production-readiness-polish` prepares the frontend for live-data integration without weakening launch gates:

- canonical Maryland Local Guide header/footer/favicon assets
- production-facing navigation and preview language
- semantic header/main/footer structure and working skip target
- route-level titles/descriptions
- disabled rather than fake actions where live workflows are gated
- service-area map previews that do not fabricate storefront pins
- representative-data and noindex safeguards retained

## Prelaunch safety

This frontend is **noindex by default** and `robots.txt` disallows crawling until deliberate launch approval. Live WordPress/Directorist data is also disabled by default; `MLG_DIRECTORY_SOURCE=representative` is the only supported provider until the live read contract is verified.

Production publishing, indexing, legal publication, transactional mail, moderation changes, and production WordPress mutation remain separate gated work.
