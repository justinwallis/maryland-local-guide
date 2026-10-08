export type DirectoryLocationMode = "service-area" | "exact";

export type DirectoryListingSummary = {
  slug: string;
  title: string;
  category: string;
  locationLabel: string;
  precisionLabel: "Service area" | "Exact-location record";
  summary: string;
  representative: true;
};

export type DirectoryListingDetail = DirectoryListingSummary & {
  description: string;
  services: readonly string[];
  serviceArea: string;
  locationDetail: string;
  locationMode: DirectoryLocationMode;
};

export type DirectorySearchInput = {
  query?: string;
  community?: string;
};

export type DirectorySearchResult = {
  source: "representative";
  items: readonly DirectoryListingSummary[];
};

export interface DirectoryReadAdapter {
  searchListings(input: DirectorySearchInput): Promise<DirectorySearchResult>;
  getListing(slug: string): Promise<DirectoryListingDetail | null>;
}
