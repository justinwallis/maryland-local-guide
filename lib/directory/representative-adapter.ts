import type {
  DirectoryListingDetail,
  DirectoryListingSummary,
  DirectoryReadAdapter,
  DirectorySearchInput,
  DirectorySearchResult,
} from "./types";

const searchItems: readonly DirectoryListingSummary[] = [
  {
    slug: "service-area-preview",
    category: "Masonry",
    title: "Masonry contractor",
    locationLabel: "Aberdeen & surrounding Harford County",
    precisionLabel: "Service area",
    summary: "Representative result-card state for a local masonry service.",
    representative: true,
    source: "representative",
  },
  {
    slug: "service-area-preview",
    category: "Water & Well",
    title: "Well service provider",
    locationLabel: "Harford County",
    precisionLabel: "Service area",
    summary: "Representative result-card state for well and water service.",
    representative: true,
    source: "representative",
  },
  {
    slug: "service-area-preview",
    category: "Tree Service",
    title: "Tree service provider",
    locationLabel: "Havre de Grace & nearby communities",
    precisionLabel: "Service area",
    summary: "Representative result-card state for local tree service.",
    representative: true,
    source: "representative",
  },
];

const details: Record<string, DirectoryListingDetail> = {
  "service-area-preview": {
    slug: "service-area-preview",
    title: "Representative masonry service",
    category: "Masonry",
    locationLabel: "Aberdeen & surrounding Harford County",
    precisionLabel: "Service area",
    summary: "Representative service-area listing detail.",
    representative: true,
    source: "representative",
    locationDetail: "Service-area record; no storefront pin should be implied.",
    description:
      "This representative state demonstrates the approved listing-detail hierarchy without using a real business name, rating, phone number, address, hours, or verification claim.",
    services: ["Masonry repair", "Brick & block work", "Small project consultation"],
    serviceArea: "Aberdeen and surrounding Harford County communities",
    locationMode: "service-area",
  },
  "exact-location-preview": {
    slug: "exact-location-preview",
    title: "Representative supplier storefront",
    category: "Supplier",
    locationLabel: "Public storefront location",
    precisionLabel: "Exact-location record",
    summary: "Representative exact-location listing detail.",
    representative: true,
    source: "representative",
    locationDetail: "Representative exact-location state — not live directory data.",
    description:
      "This second representative state proves the exact-location version of the same listing template while keeping all factual business data out of the prototype.",
    services: ["Building materials", "Project supplies", "Local pickup"],
    serviceArea: "Public storefront plus the service area supplied by the canonical record",
    locationMode: "exact",
  },
};

export const representativeDirectoryAdapter: DirectoryReadAdapter = {
  async searchListings(_input: DirectorySearchInput): Promise<DirectorySearchResult> {
    return {
      source: "representative",
      items: searchItems,
    };
  },

  async getListing(slug: string): Promise<DirectoryListingDetail | null> {
    return details[slug] ?? null;
  },
};
