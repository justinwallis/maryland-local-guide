import { mkdir, writeFile } from "node:fs/promises";

const origin = (process.env.MLG_SITE_ORIGIN || "https://marylandlocalguide.com").replace(/\/$/, "");
const publishedSlug = process.env.MLG_ACCEPT_PUBLISHED_SLUG?.trim();
const pendingSlug = process.env.MLG_ACCEPT_PENDING_SLUG?.trim();
const expectedCategorySlug = process.env.MLG_ACCEPT_CATEGORY_SLUG?.trim() || "masonry";
const expectedLocationSlug = process.env.MLG_ACCEPT_LOCATION_SLUG?.trim() || "aberdeen";
const expectedLocationMode = process.env.MLG_ACCEPT_LOCATION_MODE?.trim() || "service-area";
const outPath = "artifacts/live-listing-acceptance.json";

if (!publishedSlug || !pendingSlug) {
  console.error("MLG_ACCEPT_PUBLISHED_SLUG and MLG_ACCEPT_PENDING_SLUG are required.");
  process.exit(2);
}

if (!["service-area", "exact"].includes(expectedLocationMode)) {
  console.error("MLG_ACCEPT_LOCATION_MODE must be service-area or exact.");
  process.exit(2);
}

function arr(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  for (const key of ["data", "listings", "items", "results"]) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
}

function idOf(term) {
  if (typeof term === "number") return term;
  if (!term || typeof term !== "object") return null;
  return term.id ?? term.term_id ?? null;
}

function termBySlug(payload, slug) {
  return arr(payload).find((item) => item?.slug === slug) ?? null;
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function numeric(value) {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "string" && value.trim()) return Number.isFinite(Number(value));
  return false;
}

function mapHidden(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

function customFieldPresence(record, key) {
  const direct = record?.[key];
  const nested = record?.fields?.[key];
  const nestedValue =
    nested && typeof nested === "object" && !Array.isArray(nested) ? nested.value : undefined;

  return {
    direct: hasText(direct),
    nested: hasText(nested),
    nestedValue: hasText(nestedValue),
  };
}

function containsTerm(recordTerms, expectedId) {
  return (recordTerms ?? []).some((term) => idOf(term) === expectedId);
}

async function get(path) {
  const url = new URL(path, origin);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "user-agent": "MarylandLocalGuide-LiveAcceptance/1.0",
      },
      redirect: "follow",
      signal: controller.signal,
    });
    const text = await response.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {}
    return {
      status: response.status,
      total: Number(response.headers.get("x-wp-total") ?? "") || 0,
      totalPages: Number(response.headers.get("x-wp-totalpages") ?? "") || 0,
      json,
    };
  } finally {
    clearTimeout(timer);
  }
}

const report = {
  checkedAt: new Date().toISOString(),
  origin,
  policy: {
    authenticated: false,
    writes: false,
    methodsUsed: ["GET"],
    rawCustomFieldValuesStored: false,
  },
  inputs: {
    publishedSlug,
    pendingSlug,
    expectedCategorySlug,
    expectedLocationSlug,
    expectedLocationMode,
  },
  checks: {},
};

try {
  const [categories, locations] = await Promise.all([
    get("/wp-json/directorist/v1/listings/categories?per_page=100&hide_empty=false"),
    get("/wp-json/directorist/v1/listings/locations?per_page=100&hide_empty=false"),
  ]);

  if (categories.status !== 200 || locations.status !== 200) {
    throw new Error("Could not read public Directorist taxonomy endpoints.");
  }

  const category = termBySlug(categories.json, expectedCategorySlug);
  const location = termBySlug(locations.json, expectedLocationSlug);

  if (!category || !location) {
    throw new Error("Expected category/location slug is not present in the public taxonomy.");
  }

  const categoryId = idOf(category);
  const locationId = idOf(location);
  if (categoryId === null || locationId === null) {
    throw new Error("Expected category/location does not expose a numeric ID.");
  }

  const published = await get(
    `/wp-json/directorist/v2/listings?slug=${encodeURIComponent(publishedSlug)}&status=publish&per_page=1`,
  );
  const publishedRecord = arr(published.json)[0] ?? null;

  if (published.status !== 200 || !publishedRecord) {
    throw new Error("Controlled published listing was not visible through the public publish-safe query.");
  }

  const status = String(publishedRecord.status ?? "").toLowerCase();
  const fields =
    publishedRecord.fields && typeof publishedRecord.fields === "object"
      ? publishedRecord.fields
      : {};
  const exactSignals = {
    mapHidden: mapHidden(fields.map_hidden),
    addressPresent: hasText(fields.address),
    latitudePresent: numeric(fields.latitude),
    longitudePresent: numeric(fields.longitude),
  };
  const inferredExact =
    !exactSignals.mapHidden &&
    exactSignals.addressPresent &&
    exactSignals.latitudePresent &&
    exactSignals.longitudePresent;

  const services = customFieldPresence(publishedRecord, "custom-textarea");
  const serviceArea = customFieldPresence(publishedRecord, "custom-textarea-2");
  const customServicesPresent = services.direct || services.nested || services.nestedValue;
  const customAreaPresent = serviceArea.direct || serviceArea.nested || serviceArea.nestedValue;

  report.checks.published = {
    httpStatus: published.status,
    status,
    idPresent: typeof publishedRecord.id === "number",
    slugMatches: publishedRecord.slug === publishedSlug,
    categoryMatches: containsTerm(fields.categories, categoryId),
    locationMatches: containsTerm(fields.locations, locationId),
    servicesOfferedFieldPresent: customServicesPresent,
    serviceAreaFieldPresent: customAreaPresent,
    exactLocationSignals: exactSignals,
    inferredLocationMode: inferredExact ? "exact" : "service-area",
  };

  const [pendingDefaultV1, pendingExplicitV1, pendingEditV1, pendingDefaultV2, pendingExplicitV2, pendingEditV2] = await Promise.all([
    get(`/wp-json/directorist/v1/listings?slug=${encodeURIComponent(pendingSlug)}&per_page=1`),
    get(`/wp-json/directorist/v1/listings?slug=${encodeURIComponent(pendingSlug)}&status=pending&per_page=1`),
    get(`/wp-json/directorist/v1/listings?slug=${encodeURIComponent(pendingSlug)}&context=edit&per_page=1`),
    get(`/wp-json/directorist/v2/listings?slug=${encodeURIComponent(pendingSlug)}&per_page=1`),
    get(`/wp-json/directorist/v2/listings?slug=${encodeURIComponent(pendingSlug)}&status=pending&per_page=1`),
    get(`/wp-json/directorist/v2/listings?slug=${encodeURIComponent(pendingSlug)}&context=edit&per_page=1`),
  ]);

  report.checks.unpublishedBoundary = {
    v1: {
      defaultQueryCount: arr(pendingDefaultV1.json).length,
      explicitPendingQueryCount: arr(pendingExplicitV1.json).length,
      editContextQueryCount: arr(pendingEditV1.json).length,
      defaultHttpStatus: pendingDefaultV1.status,
      pendingHttpStatus: pendingExplicitV1.status,
      editHttpStatus: pendingEditV1.status,
    },
    v2: {
      defaultQueryCount: arr(pendingDefaultV2.json).length,
      explicitPendingQueryCount: arr(pendingExplicitV2.json).length,
      editContextQueryCount: arr(pendingEditV2.json).length,
      defaultHttpStatus: pendingDefaultV2.status,
      pendingHttpStatus: pendingExplicitV2.status,
      editHttpStatus: pendingEditV2.status,
    },
  };

  const failures = [];

  if (status !== "publish" && status !== "published") failures.push("published listing status");
  if (publishedRecord.slug !== publishedSlug) failures.push("published listing slug");
  if (!containsTerm(fields.categories, categoryId)) failures.push("category mapping");
  if (!containsTerm(fields.locations, locationId)) failures.push("location mapping");
  if (!customServicesPresent) failures.push("Services Offered custom field");
  if (!customAreaPresent) failures.push("Service Area custom field");

  if (expectedLocationMode === "exact" && !inferredExact) {
    failures.push("exact-location semantics");
  }
  if (expectedLocationMode === "service-area" && inferredExact) {
    failures.push("service-area semantics");
  }

  if (
    arr(pendingDefaultV1.json).length > 0 ||
    arr(pendingExplicitV1.json).length > 0 ||
    arr(pendingEditV1.json).length > 0 ||
    arr(pendingDefaultV2.json).length > 0 ||
    arr(pendingExplicitV2.json).length > 0 ||
    arr(pendingEditV2.json).length > 0
  ) {
    failures.push("unpublished listing boundary");
  }

  report.result = failures.length === 0 ? "PASS" : "FAIL";
  report.failures = failures;
} catch (error) {
  report.result = "BLOCKED";
  report.error = error instanceof Error ? error.message : String(error);
}

await mkdir("artifacts", { recursive: true });
await writeFile(outPath, JSON.stringify(report, null, 2) + "\n", "utf8");

console.log("MLG controlled live-listing acceptance:", report.result);
console.log("Artifact:", outPath);

if (report.result !== "PASS") process.exitCode = 2;
