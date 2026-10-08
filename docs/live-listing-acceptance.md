# Controlled Live Listing Acceptance

Status: **STAGED / MANUAL / NO LIVE MUTATION**

This packet is the final read-only acceptance step before the staged WordPress/Directorist adapter can be considered for activation.

## Preconditions

Do not run this workflow until an **authorized WordPress execution window** has produced:

1. one controlled Home Services listing intentionally published for the test;
2. one controlled companion record intentionally left Pending or Draft;
3. both records use clearly synthetic QA identities and no real customer/person data;
4. indexing remains disabled;
5. the published fixture has the canonical Home Services fields populated:
   - Description
   - Services Offered (`custom-textarea`)
   - Service Area (`custom-textarea-2`)
   - Masonry (or the chosen controlled category)
   - Aberdeen (or the chosen controlled community)
6. its location treatment is deliberate:
   - **service-area**: map hidden and/or no complete public address + exact coordinates;
   - **exact**: public address + exact coordinates + map visible.

Creating/publishing the fixture is a separate approval-gated WordPress action. This workflow itself performs **GET only**.

## What the workflow proves

The manual `Live Listing Acceptance` workflow checks the live public API for:

- published listing visibility;
- canonical category ID mapping;
- canonical location ID mapping;
- Services Offered field presence;
- Service Area field presence;
- exact versus service-area map semantics;
- default unauthenticated non-exposure of the Pending/Draft companion;
- explicit unauthenticated `status=pending` non-exposure;
- unauthenticated `context=edit` non-exposure.

It writes only bounded evidence: booleans, counts, IDs/statuses and presence signals. It does not store custom-field values.

## Stop conditions

Do not activate the live adapter if:

- the published fixture is missing from the public API;
- the custom fields are not present in a stable read shape;
- category/community IDs do not match the canonical taxonomy;
- a service-area record qualifies as an exact storefront;
- an exact-location record lacks any required public location signal;
- any unauthenticated query exposes the controlled Pending/Draft record.

## Cleanup

After evidence is captured:

1. remove, trash or restore the controlled published fixture according to the owning QA packet;
2. remove the companion synthetic record;
3. confirm the public listing count returns to the expected state;
4. write the outcome into MLG Launch QA and the UI/implementation roadmap;
5. only then consider changing `MLG_LIVE_DIRECTORY_ACCEPTED`.

This packet does **not** remove noindex/robots restrictions and does not authorize launch.
