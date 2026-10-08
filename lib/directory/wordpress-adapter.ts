import type {
  DirectoryListingDetail,
  DirectoryListingSummary,
  DirectoryReadAdapter,
  DirectorySearchInput,
  DirectorySearchResult,
} from "./types";

type FetchLike = typeof fetch;

type AdapterOptions = {
  origin?: string;
  fetchImpl?: FetchLike;
};

type DirectoristTerm = {
  id?: number;
  term_id?: number;
  name?: string;
  slug?: string;
  parent?: number;
  directory?: number[];
};

type DirectoristDirectory = {
  id?: number;
  name?: string;
  slug?: string;
};

type DirectoristListing = {
  [key: string]: unknown;
  id?: number;
  slug?: string;
  name?: string;
  status?: string;
  permalink?: string;
  directory?: number | { id?: number; name?: string; slug?: string };
  categories?: Array<number | DirectoristTerm>;
  locations?: Array<number | DirectoristTerm>;
  description?: string;
  short_description?: string;
  tagline?: string;
  address?: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  map_hidden?: boolean | number | string | null;
  fields?: Record<string, unknown>;
};

const DEFAULT_ORIGIN = "https://marylandlocalguide.com";

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function plainText(value?: string | null): string {
  if (!value) return "";
  return decodeHtmlEntities(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

function clampSummary(value: string, max = 220): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function isMapHidden(value: unknown): boolean {
  return value === true || value === 1 || value === "1" || value === "true";
}

function arrayFromPayload<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;
  for (const key of ["data", "listings", "items", "results"]) {
    if (Array.isArray(record[key])) return record[key] as T[];
  }
  return [];
}

function termId(term: number | DirectoristTerm): number | null {
  if (typeof term === "number") return term;
  return term.id ?? term.term_id ?? null;
}

function termName(
  term: number | DirectoristTerm,
  lookup: ReadonlyMap<number, DirectoristTerm>,
): string | null {
  if (typeof term === "object" && typeof term.name === "string" && term.name.trim()) {
    return decodeHtmlEntities(term.name.trim());
  }
  const id = termId(term);
  if (id === null) return null;
  const match = lookup.get(id);
  return match?.name ? decodeHtmlEntities(match.name) : null;
}

function namesForTerms(
  terms: Array<number | DirectoristTerm> | undefined,
  lookup: ReadonlyMap<number, DirectoristTerm>,
): string[] {
  return (terms ?? [])
    .map((term) => termName(term, lookup))
    .filter((name): name is string => Boolean(name));
}

function communitySlug(input?: string): string | undefined {
  if (!input) return undefined;
  if (input === "harford") return "harford-county";
  return input;
}

function positiveInteger(value: number | undefined, fallback: number, max: number): number {
  if (!Number.isInteger(value) || (value ?? 0) < 1) return fallback;
  return Math.min(value as number, max);
}

function published(record: DirectoristListing): boolean {
  if (!record.status) return true;
  const normalized = record.status.toLowerCase();
  return normalized === "publish" || normalized === "published";
}

function exactLocation(record: DirectoristListing): boolean {
  const lat = asNumber(record.latitude);
  const long = asNumber(record.longitude);
  const address = plainText(record.address);
  return !isMapHidden(record.map_hidden) && lat !== null && long !== null && Boolean(address);
}

function customFieldText(record: DirectoristListing, fieldKey: string): string {
  const direct = record[fieldKey];
  if (typeof direct === "string") return plainText(direct);

  const nested = record.fields?.[fieldKey];
  if (typeof nested === "string") return plainText(nested);

  if (nested && typeof nested === "object") {
    const value = (nested as Record<string, unknown>).value;
    if (typeof value === "string") return plainText(value);
  }

  return "";
}

function listingCategory(
  record: DirectoristListing,
  categories: ReadonlyMap<number, DirectoristTerm>,
): string {
  return namesForTerms(record.categories, categories)[0] ?? "Local service";
}

function listingLocations(
  record: DirectoristListing,
  locations: ReadonlyMap<number, DirectoristTerm>,
): string[] {
  return namesForTerms(record.locations, locations);
}

function toSummary(
  record: DirectoristListing,
  categories: ReadonlyMap<number, DirectoristTerm>,
  locations: ReadonlyMap<number, DirectoristTerm>,
): DirectoryListingSummary | null {
  if (!published(record)) return null;
  const slug = record.slug?.trim();
  const title = plainText(record.name);
  if (!slug || !title) return null;

  const locNames = listingLocations(record, locations);
  const exact = exactLocation(record);
  const address = plainText(record.address);
  const locationLabel = exact
    ? address
    : locNames.length
      ? locNames.join(", ")
      : "Harford County";

  const summarySource =
    plainText(record.short_description) ||
    plainText(record.tagline) ||
    plainText(record.description) ||
    "Local directory listing.";

  return {
    canonicalId: typeof record.id === "number" ? record.id : undefined,
    canonicalUrl: typeof record.permalink === "string" ? record.permalink : undefined,
    slug,
    title,
    category: listingCategory(record, categories),
    locationLabel,
    precisionLabel: exact ? "Exact-location record" : "Service area",
    summary: clampSummary(summarySource),
    representative: false,
    source: "wordpress",
  };
}

function toDetail(
  record: DirectoristListing,
  categories: ReadonlyMap<number, DirectoristTerm>,
  locations: ReadonlyMap<number, DirectoristTerm>,
): DirectoryListingDetail | null {
  const summary = toSummary(record, categories, locations);
  if (!summary) return null;

  const locNames = listingLocations(record, locations);
  const exact = exactLocation(record);
  const address = plainText(record.address);
  const servicesOffered = customFieldText(record, "custom-textarea");
  const serviceAreaText = customFieldText(record, "custom-textarea-2");

  return {
    ...summary,
    description:
      plainText(record.description) ||
      plainText(record.short_description) ||
      "No public description is available yet.",
    services: servicesOffered
      ? servicesOffered
          .split(/\r?\n|;|•/)
          .map((item) => item.trim())
          .filter(Boolean)
      : [],
    serviceArea: serviceAreaText ||
      (exact
        ? locNames.join(", ") || "See the canonical listing for current service-area information."
        : locNames.join(", ") || "Harford County"),
    locationDetail: exact
      ? `Public exact-location record${address ? `: ${address}` : ""}.`
      : "Service-area record; no storefront pin should be implied.",
    locationMode: exact ? "exact" : "service-area",
  };
}

function mapById(items: DirectoristTerm[]): Map<number, DirectoristTerm> {
  const map = new Map<number, DirectoristTerm>();
  for (const item of items) {
    const id = item.id ?? item.term_id;
    if (typeof id === "number") map.set(id, item);
  }
  return map;
}

async function responseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text.trim()) return [];
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Directorist returned non-JSON data (HTTP ${response.status}).`);
  }
}

function buildUrl(origin: string, path: string, params?: URLSearchParams): string {
  const url = new URL(path, origin);
  if (params) url.search = params.toString();
  return url.toString();
}

export function createWordPressDirectoryAdapter(
  options: AdapterOptions = {},
): DirectoryReadAdapter {
  const origin = (options.origin ?? process.env.MLG_WORDPRESS_ORIGIN ?? DEFAULT_ORIGIN).replace(/\/$/, "");
  const fetchImpl = options.fetchImpl ?? fetch;

  async function get(path: string, params?: URLSearchParams) {
    const response = await fetchImpl(buildUrl(origin, path, params), {
      method: "GET",
      headers: {
        accept: "application/json",
        "user-agent": "MarylandLocalGuide-Frontend/1.0",
      },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      throw new Error(`Directorist read failed (HTTP ${response.status}).`);
    }
    return {
      payload: await responseJson(response),
      total: Number(response.headers.get("x-wp-total") ?? "") || undefined,
      totalPages: Number(response.headers.get("x-wp-totalpages") ?? "") || undefined,
    };
  }

  async function taxonomyContext() {
    const [directoriesResponse, categoriesResponse, locationsResponse] = await Promise.all([
      get("/wp-json/directorist/v1/directories"),
      get("/wp-json/directorist/v1/listings/categories", new URLSearchParams({
        per_page: "100",
        hide_empty: "false",
      })),
      get("/wp-json/directorist/v1/listings/locations", new URLSearchParams({
        per_page: "100",
        hide_empty: "false",
      })),
    ]);

    const directories = arrayFromPayload<DirectoristDirectory>(directoriesResponse.payload);
    const categories = arrayFromPayload<DirectoristTerm>(categoriesResponse.payload);
    const locations = arrayFromPayload<DirectoristTerm>(locationsResponse.payload);

    return {
      directories,
      categories,
      locations,
      categoryMap: mapById(categories),
      locationMap: mapById(locations),
    };
  }

  async function directoryId(
    directories: DirectoristDirectory[],
    requested = "home-services",
  ): Promise<number> {
    const match = directories.find((item) => item.slug === requested);
    if (typeof match?.id !== "number") {
      throw new Error(`Directorist directory "${requested}" is not available.`);
    }
    return match.id;
  }

  return {
    async searchListings(input: DirectorySearchInput): Promise<DirectorySearchResult> {
      const context = await taxonomyContext();
      const requestedDirectory = input.directory ?? "home-services";
      const resolvedDirectoryId = await directoryId(context.directories, requestedDirectory);

      const params = new URLSearchParams({
        directory: String(resolvedDirectoryId),
        status: "publish",
        page: String(positiveInteger(input.page, 1, 10_000)),
        per_page: String(positiveInteger(input.perPage, 12, 50)),
        order: "asc",
        orderby: "name",
      });

      if (input.query?.trim()) params.set("search", input.query.trim());

      const locationSlug = communitySlug(input.community);
      if (locationSlug) {
        const location = context.locations.find((item) => item.slug === locationSlug);
        if (typeof location?.id !== "number") {
          return {
            source: "wordpress",
            items: [],
            total: 0,
            page: positiveInteger(input.page, 1, 10_000),
            totalPages: 0,
          };
        }
        params.set("locations", String(location.id));
      }

      const result = await get("/wp-json/directorist/v1/listings", params);
      const records = arrayFromPayload<DirectoristListing>(result.payload);
      const items = records
        .map((record) => toSummary(record, context.categoryMap, context.locationMap))
        .filter((item): item is DirectoryListingSummary => Boolean(item));

      return {
        source: "wordpress",
        items,
        total: result.total,
        page: positiveInteger(input.page, 1, 10_000),
        totalPages: result.totalPages,
      };
    },

    async getListing(slug: string): Promise<DirectoryListingDetail | null> {
      if (!slug.trim()) return null;

      const context = await taxonomyContext();
      const resolvedDirectoryId = await directoryId(context.directories, "home-services");
      const params = new URLSearchParams({
        directory: String(resolvedDirectoryId),
        status: "publish",
        slug: slug.trim(),
        per_page: "1",
      });

      const result = await get("/wp-json/directorist/v1/listings", params);
      const record = arrayFromPayload<DirectoristListing>(result.payload)[0];
      if (!record) return null;

      return toDetail(record, context.categoryMap, context.locationMap);
    },
  };
}

export const wordpressDirectoryAdapter = createWordPressDirectoryAdapter();
